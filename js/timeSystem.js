// Time system management
class TimeSystem {
    constructor() {
        this.isRunning = false;
        this.lastTick = 0;
    }

    tick() {
        const state = window.gameState;
        state.time.ticks++;

        // Check for cycle completion
        if (state.time.ticks >= state.time.ticksPerCycle) {
            state.time.ticks = 0;
            state.time.cycles++;
            
            // Trigger cycle-based events
            this.onCycleComplete();
        }

        // Update progress bar
        this.updateProgressBar();
        
        // Check hexagram unlock conditions
        window.hexagramSystem.checkUnlockConditions();
        
        // Spawn sprouts if conditions are met
        this.handleSproutSpawning();
        
        // Update sprouts (decay, etc.)
        this.updateSprouts();
        
        // Emit tick event for other systems
        this.onTick();
    }

    onCycleComplete() {
        const state = window.gameState;
        console.log(`Cycle ${state.time.cycles} completed`);
        
        // Special events based on cycle number
        if (state.time.cycles === 1 && !state.musicPlayed) {
            // Unlock Xū hexagram and play music
            window.hexagramSystem.unlockHexagram("Xū");
        }
    }

    onTick() {
        // Update UI
        this.updateTimeDisplay();
        
        // Save game state periodically
        if (window.gameState.time.ticks % 10 === 0) {
            window.gameState.save();
        }
    }

    handleSproutSpawning() {
        const state = window.gameState;
        
        if (state.hexagramQianUnlocked && 
            state.time.ticks % state.SPAWN_INTERVAL === 0 && 
            state.sprouts.size < state.MAX_SPROUTS) {
            this.spawnSprout();
        }
    }

    spawnSprout() {
        const state = window.gameState;
        const playerPos = state.player;
        
        // Find a suitable position for the sprout
        const maxAttempts = 50;
        for (let i = 0; i < maxAttempts; i++) {
            const x = playerPos.x + Math.floor(Math.random() * 21) - 10; // ±10 from player
            const y = playerPos.y + Math.floor(Math.random() * 21) - 10;
            
            if (state.isValidPosition(x, y)) {
                const posKey = state.positionKey(x, y);
                
                // Don't spawn on player position or existing sprouts
                if ((x !== playerPos.x || y !== playerPos.y) && !state.sprouts.has(posKey)) {
                    state.sprouts.set(posKey, {
                        x: x,
                        y: y,
                        age: 0,
                        maxAge: 200 + Math.floor(Math.random() * 100) // Random lifespan
                    });
                    break;
                }
            }
        }
    }

    updateSprouts() {
        const state = window.gameState;
        const sproutsToRemove = [];
        
        for (const [posKey, sprout] of state.sprouts) {
            sprout.age++;
            
            // Remove sprouts that have exceeded their lifespan
            if (sprout.age > sprout.maxAge) {
                sproutsToRemove.push(posKey);
            }
        }
        
        // Remove aged sprouts
        sproutsToRemove.forEach(posKey => {
            state.sprouts.delete(posKey);
        });
    }

    updateProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        const cycleSymbol = document.getElementById('cycle-symbol');
        
        if (progressBar) {
            const progress = (window.gameState.time.ticks / window.gameState.time.ticksPerCycle) * 100;
            progressBar.style.setProperty('--progress', `${progress}%`);
        }
        
        if (cycleSymbol) {
            cycleSymbol.textContent = window.hexagramSystem.getCurrentCycleSymbol();
        }
    }

    updateTimeDisplay() {
        const state = window.gameState;
        
        // Update various UI elements
        const elements = {
            'ticks-display': state.time.ticks,
            'idle-display': state.time.idleTicks,
            'ghis-display': state.ghisPoints,
            'steps-display': state.player.stepsTaken,
            'position-display': `${state.player.x}, ${state.player.y}`,
            'sprout-count': state.sproutCount
        };
        
        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
        
        // Show/hide sprout display based on Qián unlock
        const sproutDisplay = document.getElementById('sprout-display');
        if (sproutDisplay) {
            sproutDisplay.style.display = state.hexagramQianUnlocked ? 'flex' : 'none';
        }
    }

    // Handle idle time when player doesn't move
    idle() {
        const state = window.gameState;
        state.time.idleTicks++;
        state.ghisPoints++;
        
        // Update tile states based on idle behavior
        this.updateTileStates();
        
        // Regular tick processing
        this.tick();
    }

    updateTileStates() {
        const state = window.gameState;
        const playerPos = state.player;
        const posKey = state.positionKey(playerPos.x, playerPos.y);
        
        // Update idle ticks for current tile
        const currentIdleTicks = (state.tileIdleTicks.get(posKey) || 0) + 1;
        state.tileIdleTicks.set(posKey, currentIdleTicks);
        
        // Update tile state based on idle ticks
        if (currentIdleTicks >= 20) {
            state.tileStates.set(posKey, 4); // Fully activated
        } else {
            const stateIndex = Math.floor(currentIdleTicks / 5);
            state.tileStates.set(posKey, Math.min(stateIndex, 3));
        }
        
        // Propagate ripple effect
        this.propagateRipple(playerPos.x, playerPos.y, Math.floor(state.time.idleTicks / 5));
    }

    propagateRipple(centerX, centerY, radius) {
        const state = window.gameState;
        
        if (radius < 1) return;
        
        for (let r = 1; r <= radius; r++) {
            for (let y = centerY - r; y <= centerY + r; y++) {
                for (let x = centerX - r; x <= centerX + r; x++) {
                    if (state.isValidPosition(x, y)) {
                        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                        
                        if (distance <= r && distance > r - 1) {
                            const posKey = state.positionKey(x, y);
                            
                            // Add to visited tiles
                            state.visitedTiles.add(posKey);
                            
                            // Update idle ticks for this tile
                            const currentTicks = (state.tileIdleTicks.get(posKey) || 0) + 1;
                            state.tileIdleTicks.set(posKey, currentTicks);
                            
                            // Update tile state
                            if (currentTicks >= 20) {
                                state.tileStates.set(posKey, 4); // Fully activated
                            } else {
                                const stateIndex = Math.floor(currentTicks / 5);
                                state.tileStates.set(posKey, Math.min(stateIndex, 3));
                            }
                        }
                    }
                }
            }
        }
    }

    // Reset idle ticks when player moves
    resetIdle() {
        window.gameState.time.idleTicks = 0;
    }
}

// Global time system instance
window.timeSystem = new TimeSystem();