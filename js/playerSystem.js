// Player system for movement and interaction
class PlayerSystem {
    constructor() {
        this.lastMoveTime = 0;
        this.moveDelay = 100; // Minimum time between moves in ms
    }

    move(deltaX, deltaY) {
        const currentTime = Date.now();
        if (currentTime - this.lastMoveTime < this.moveDelay) {
            return false; // Too soon to move again
        }

        const state = window.gameState;
        const newX = state.player.x + deltaX;
        const newY = state.player.y + deltaY;

        // Check bounds
        if (!state.isValidPosition(newX, newY)) {
            return false;
        }

        // Store previous position
        const oldPosKey = state.positionKey(state.player.x, state.player.y);
        
        // Add old position to visited tiles
        state.visitedTiles.add(oldPosKey);

        // Update player position
        state.player.x = newX;
        state.player.y = newY;
        state.player.stepsTaken++;

        // Reset idle timer when moving
        window.timeSystem.resetIdle();

        // Check for interactions at new position
        this.checkInteractions();

        // Advance time with movement
        window.timeSystem.tick();

        this.lastMoveTime = currentTime;
        return true;
    }

    checkInteractions() {
        const state = window.gameState;
        const playerPosKey = state.positionKey(state.player.x, state.player.y);

        // Check for sprout collection
        if (state.hexagramQianUnlocked && state.sprouts.has(playerPosKey)) {
            this.collectSprout(playerPosKey);
        }

        // Check for receptive zone interaction
        if (state.receptiveZones.has(playerPosKey)) {
            this.activateReceptiveZone(playerPosKey);
        }

        // Check hexagram unlock conditions after movement
        window.hexagramSystem.checkUnlockConditions();
    }

    collectSprout(posKey) {
        const state = window.gameState;
        if (state.sprouts.has(posKey)) {
            state.sprouts.delete(posKey);
            state.sproutCount++;
            
            // Play collection sound
            this.playCollectionSound();
            
            // Visual feedback
            this.showCollectionEffect();
            
            console.log(`Collected sprout! Total: ${state.sproutCount}`);
            
            // Check if collecting sprouts unlocks new hexagrams
            this.checkSproutMilestones();
        }
    }

    activateReceptiveZone(posKey) {
        // Receptive zone interactions
        console.log("Activated receptive zone at", posKey);
        
        // Add special effects or mechanics here
        // For example, could restore energy, unlock hexagrams, etc.
    }

    playCollectionSound() {
        // Play sound effect for sprout collection
        // This would integrate with an audio system
        console.log("Playing collection sound");
    }

    showCollectionEffect() {
        // Visual feedback for collection
        // This would integrate with the rendering system
        console.log("Showing collection effect");
    }

    checkSproutMilestones() {
        const state = window.gameState;
        
        // Unlock hexagrams based on sprout collection milestones
        if (state.sproutCount >= 9 && !window.hexagramSystem.getHexagram("Kūn")) {
            window.hexagramSystem.unlockHexagram("Kūn");
        }
        
        if (state.sproutCount >= 27) {
            window.hexagramSystem.unlockHexagram("Zhūn");
        }
        
        if (state.sproutCount >= 81) {
            window.hexagramSystem.unlockHexagram("Méng");
        }
    }

    // Handle keyboard input
    handleKeyPress(event) {
        const key = event.key;
        let moved = false;

        switch (key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                moved = this.move(0, -1);
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                moved = this.move(0, 1);
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                moved = this.move(-1, 0);
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                moved = this.move(1, 0);
                break;
            case ' ':
                // Space bar for idling
                window.timeSystem.idle();
                moved = true; // Prevent default behavior
                break;
            case 'r':
            case 'R':
                // Reset game
                this.resetGame();
                moved = true;
                break;
        }

        if (moved) {
            event.preventDefault();
            
            // Re-render the game
            if (window.renderer) {
                window.renderer.render();
            }
        }
    }

    resetGame() {
        if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
            window.gameState.reset();
            window.hexagramSystem.updateHexagramDisplay();
            window.timeSystem.updateTimeDisplay();
            window.timeSystem.updateProgressBar();
            
            if (window.renderer) {
                window.renderer.render();
            }
            
            console.log('Game reset');
        }
    }

    // Get player texture/symbol
    getTexture() {
        return "𐍈"; // Player character
    }

    // Initialize player input handling
    initializeInput() {
        document.addEventListener('keydown', (event) => {
            this.handleKeyPress(event);
        });

        // Prevent arrow keys from scrolling the page
        document.addEventListener('keydown', (event) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
                event.preventDefault();
            }
        });

        console.log('Player input initialized');
    }
}

// Global player system instance
window.playerSystem = new PlayerSystem();