// Main game engine coordination
class GameEngine {
    constructor() {
        this.isRunning = false;
        this.lastUpdate = 0;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        this.systems = [];
    }

    initialize() {
        console.log('Initializing SOIL Game Engine...');
        
        // Initialize renderer
        window.renderer = new Renderer('game-canvas');
        
        // Initialize input system
        window.playerSystem.initializeInput();
        
        // Try to load saved game state
        if (window.gameState.load()) {
            console.log('Loaded saved game state');
            this.updateUI();
        } else {
            console.log('Starting new game');
        }
        
        // Initialize hexagram display
        window.hexagramSystem.updateHexagramDisplay();
        
        // Update time display
        window.timeSystem.updateTimeDisplay();
        window.timeSystem.updateProgressBar();
        
        // Initial render
        window.renderer.render();
        
        // Start auto-save
        this.startAutoSave();
        
        // Enable mouse interactions
        window.renderer.initializeMouseEvents();
        
        // Start performance monitoring in debug mode
        if (window.gameState.DEBUG_MODE) {
            window.renderer.startPerformanceMonitoring();
        }
        
        this.isRunning = true;
        console.log('SOIL Game Engine initialized successfully!');
    }

    updateUI() {
        // Update all UI elements
        window.timeSystem.updateTimeDisplay();
        window.timeSystem.updateProgressBar();
        window.hexagramSystem.updateHexagramDisplay();
    }

    // Auto-save system
    startAutoSave() {
        setInterval(() => {
            window.gameState.save();
        }, 30000); // Auto-save every 30 seconds
    }

    // Game loop (currently not needed since it's turn-based)
    gameLoop(currentTime) {
        if (!this.isRunning) return;

        // Calculate delta time
        const deltaTime = currentTime - this.lastUpdate;
        
        if (deltaTime >= this.frameInterval) {
            // Update systems that need continuous updates
            this.update(deltaTime);
            
            // Render
            if (window.renderer) {
                window.renderer.render();
            }
            
            this.lastUpdate = currentTime;
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        // Update any systems that need continuous updates
        // For now, SOIL is mostly turn-based, so this is minimal
        
        // Update sprout ages and other time-based effects
        // This is already handled in the time system
    }

    // Debug methods
    enableDebugMode() {
        window.gameState.DEBUG_MODE = true;
        this.addDebugControls();
        console.log('Debug mode enabled');
    }

    addDebugControls() {
        // Add debug keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (!window.gameState.DEBUG_MODE) return;
            
            switch (event.key) {
                case 'F1':
                    // Debug info
                    this.showDebugInfo();
                    event.preventDefault();
                    break;
                case 'F2':
                    // Toggle ASCII rendering
                    window.renderer.renderASCII();
                    event.preventDefault();
                    break;
                case 'F3':
                    // Log map state
                    window.mapSystem.logMapState();
                    event.preventDefault();
                    break;
                case 'F4':
                    // Unlock random hexagram
                    this.unlockRandomHexagram();
                    event.preventDefault();
                    break;
                case 'F5':
                    // Add sprouts near player
                    this.addDebugSprouts();
                    event.preventDefault();
                    break;
            }
        });
    }

    showDebugInfo() {
        const state = window.gameState;
        console.log('=== DEBUG INFO ===');
        console.log('Player:', state.player);
        console.log('Time:', state.time);
        console.log('Ghis Points:', state.ghisPoints);
        console.log('Unlocked Hexagrams:', state.unlockedHexagrams.length);
        console.log('Sprouts:', state.sprouts.size);
        console.log('Visited Tiles:', state.visitedTiles.size);
        console.log('==================');
    }

    unlockRandomHexagram() {
        const availableHexagrams = window.hexagramSystem.hexagrams.filter(h => 
            !window.gameState.unlockedHexagrams.some(unlocked => unlocked.name === h.name)
        );
        
        if (availableHexagrams.length > 0) {
            const randomHexagram = availableHexagrams[Math.floor(Math.random() * availableHexagrams.length)];
            window.hexagramSystem.unlockHexagram(randomHexagram.name);
            console.log(`Debug: Unlocked ${randomHexagram.name}`);
        }
    }

    addDebugSprouts() {
        const state = window.gameState;
        for (let i = 0; i < 5; i++) {
            const x = state.player.x + Math.floor(Math.random() * 11) - 5;
            const y = state.player.y + Math.floor(Math.random() * 11) - 5;
            
            if (state.isValidPosition(x, y)) {
                const posKey = state.positionKey(x, y);
                if (!state.sprouts.has(posKey)) {
                    state.sprouts.set(posKey, {
                        x: x,
                        y: y,
                        age: 0,
                        maxAge: 500
                    });
                }
            }
        }
        console.log('Debug: Added sprouts near player');
        window.renderer.render();
    }

    // Error handling
    handleError(error) {
        console.error('Game Engine Error:', error);
        
        // Try to save current state before crashing
        try {
            window.gameState.save();
        } catch (saveError) {
            console.error('Failed to save game state during error:', saveError);
        }
        
        // Show user-friendly error message
        alert('An error occurred in the game engine. The game state has been saved. Please refresh the page.');
    }

    // Shutdown
    shutdown() {
        this.isRunning = false;
        window.gameState.save();
        console.log('Game engine shut down');
    }

    // Export game state for debugging
    exportGameState() {
        const state = {
            player: window.gameState.player,
            time: window.gameState.time,
            ghisPoints: window.gameState.ghisPoints,
            unlockedHexagrams: window.gameState.unlockedHexagrams,
            sprouts: Array.from(window.gameState.sprouts.entries()),
            sproutCount: window.gameState.sproutCount,
            visitedTiles: Array.from(window.gameState.visitedTiles),
            tileStates: Array.from(window.gameState.tileStates.entries())
        };
        
        const json = JSON.stringify(state, null, 2);
        console.log('Exported game state:', json);
        
        // Copy to clipboard if available
        if (navigator.clipboard) {
            navigator.clipboard.writeText(json).then(() => {
                console.log('Game state copied to clipboard');
            });
        }
        
        return json;
    }
}

// Global game engine instance
window.gameEngine = new GameEngine();

// Set up global error handling
window.addEventListener('error', (event) => {
    window.gameEngine.handleError(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    window.gameEngine.handleError(event.reason);
});

// Save game state when page is about to unload
window.addEventListener('beforeunload', () => {
    window.gameState.save();
});