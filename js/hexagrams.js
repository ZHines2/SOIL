// Hexagram data and management
class HexagramSystem {
    constructor() {
        // I Ching hexagrams data (converted from iChing.JSON)
        this.hexagrams = [
            { number: 1, name: "Qián", character: "乾", unicode: "䷀", meaning: "The Creative" },
            { number: 2, name: "Kūn", character: "坤", unicode: "䷁", meaning: "The Receptive" },
            { number: 3, name: "Zhūn", character: "屯", unicode: "䷂", meaning: "Difficulty at the Beginning" },
            { number: 4, name: "Méng", character: "蒙", unicode: "䷃", meaning: "Youthful Folly" },
            { number: 5, name: "Xū", character: "需", unicode: "䷄", meaning: "Waiting (Nourishment)" },
            { number: 6, name: "Sòng", character: "訟", unicode: "䷅", meaning: "Conflict" },
            { number: 7, name: "Shī", character: "師", unicode: "䷆", meaning: "The Army" },
            { number: 8, name: "Bǐ", character: "比", unicode: "䷇", meaning: "Holding Together (Union)" },
            { number: 9, name: "Xiǎo Chù", character: "小畜", unicode: "䷈", meaning: "The Taming Power of the Small" },
            { number: 10, name: "Lǚ", character: "履", unicode: "䷉", meaning: "Treading (Conduct)" },
            { number: 11, name: "Tài", character: "泰", unicode: "䷊", meaning: "Peace" },
            { number: 12, name: "Pǐ", character: "否", unicode: "䷋", meaning: "Standstill (Stagnation)" },
            { number: 13, name: "Tóng Rén", character: "同人", unicode: "䷌", meaning: "Fellowship with Men" },
            { number: 14, name: "Dà Yǒu", character: "大有", unicode: "䷍", meaning: "Possession in Great Measure" },
            { number: 15, name: "Qiān", character: "謙", unicode: "䷎", meaning: "Modesty" },
            { number: 16, name: "Yù", character: "豫", unicode: "䷏", meaning: "Enthusiasm" }
            // Note: Only including first 16 for initial implementation
            // Can add all 64 hexagrams later
        ];

        this.hexagramsByName = new Map();
        this.hexagrams.forEach(h => this.hexagramsByName.set(h.name, h));
    }

    getHexagram(name) {
        return this.hexagramsByName.get(name);
    }

    checkUnlockConditions() {
        const state = window.gameState;
        
        // Qián (The Creative) - First hexagram
        if (state.ghisPoints >= 9 && state.player.stepsTaken >= 9 && state.time.idleTicks >= 9) {
            this.unlockHexagram("Qián");
        }

        // Additional unlock conditions can be added here
        // Each hexagram should have unique unlock conditions based on game progression
    }

    unlockHexagram(name) {
        const state = window.gameState;
        const hexagram = this.getHexagram(name);
        
        if (!hexagram) {
            console.warn(`Hexagram ${name} not found`);
            return;
        }

        // Check if already unlocked
        if (state.unlockedHexagrams.some(h => h.name === name)) {
            return;
        }

        // Add to unlocked hexagrams
        state.unlockedHexagrams.push(hexagram);
        
        // Trigger hexagram-specific mechanics
        this.triggerHexagramMechanics(name);
        
        // Update UI
        this.updateHexagramDisplay();
        
        // Play unlock sound (if audio system is implemented)
        this.playUnlockSound(name);
        
        console.log(`Unlocked hexagram: ${name} (${hexagram.unicode}) - ${hexagram.meaning}`);
    }

    triggerHexagramMechanics(name) {
        const state = window.gameState;
        
        switch (name) {
            case "Qián":
                // The Creative - Initialize sprout mechanics
                state.hexagramQianUnlocked = true;
                this.initializeSproutMechanics();
                break;
                
            case "Kūn":
                // The Receptive - Spawn receptive zones
                this.spawnReceptiveZone();
                break;
                
            case "Xū":
                // Waiting (Nourishment) - Triggered by time progression
                this.playMusic();
                break;
                
            // Add more hexagram-specific mechanics here
        }
    }

    initializeSproutMechanics() {
        const state = window.gameState;
        state.sprouts.clear();
        state.sproutCount = 0;
        console.log("Sprout mechanics initialized");
    }

    spawnReceptiveZone() {
        const state = window.gameState;
        const playerPos = state.player;
        
        // Spawn receptive zones in a pattern around the player
        for (let radius = 5; radius <= 15; radius += 5) {
            for (let angle = 0; angle < 360; angle += 45) {
                const rad = (angle * Math.PI) / 180;
                const x = Math.round(playerPos.x + radius * Math.cos(rad));
                const y = Math.round(playerPos.y + radius * Math.sin(rad));
                
                if (state.isValidPosition(x, y)) {
                    state.receptiveZones.add(state.positionKey(x, y));
                }
            }
        }
        
        state.receptiveZoneSpawned = true;
        console.log("Receptive zones spawned");
    }

    playMusic() {
        const state = window.gameState;
        if (!state.musicPlayed) {
            // Play ambient music when Xū is unlocked
            // This would integrate with an audio system
            console.log("Playing music for Xū hexagram");
            state.musicPlayed = true;
        }
    }

    playUnlockSound(name) {
        // Play sound effect for hexagram unlock
        // This would integrate with an audio system
        console.log(`Playing unlock sound for ${name}`);
    }

    updateHexagramDisplay() {
        const hexagramList = document.getElementById('hexagram-list');
        if (!hexagramList) return;
        
        hexagramList.innerHTML = '';
        
        window.gameState.unlockedHexagrams.forEach(hexagram => {
            const item = document.createElement('div');
            item.className = 'hexagram-item newly-unlocked';
            item.innerHTML = `
                <div class="hexagram-symbol">${hexagram.unicode}</div>
                <div class="hexagram-name">${hexagram.name}</div>
            `;
            item.title = hexagram.meaning;
            hexagramList.appendChild(item);
            
            // Remove animation class after animation completes
            setTimeout(() => {
                item.classList.remove('newly-unlocked');
            }, 2000);
        });
    }

    getCycleSymbols() {
        return ["⨀", "⨁", "⨂", "⨃", "⨄", "⨅", "⨆", "⨇", "⨈", "⨉"];
    }

    getCurrentCycleSymbol() {
        const symbols = this.getCycleSymbols();
        return symbols[window.gameState.time.cycles % symbols.length];
    }
}

// Global hexagram system instance
window.hexagramSystem = new HexagramSystem();