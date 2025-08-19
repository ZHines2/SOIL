// Main entry point for the SOIL game
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌱 SOIL - Emergent Mechanic Game Engine');
    console.log('土 Based on the I Ching philosophy 土');
    console.log('=====================================');
    
    // Initialize the game engine
    try {
        window.gameEngine.initialize();
        
        // Enable debug mode in development
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            window.gameEngine.enableDebugMode();
            console.log('🐛 Debug mode enabled (localhost detected)');
            console.log('Debug shortcuts:');
            console.log('F1 - Show debug info');
            console.log('F2 - Toggle ASCII rendering');
            console.log('F3 - Log map state');
            console.log('F4 - Unlock random hexagram');
            console.log('F5 - Add debug sprouts');
        }
        
        // Display welcome message
        showWelcomeMessage();
        
        // Add version info
        addVersionInfo();
        
    } catch (error) {
        console.error('Failed to initialize game engine:', error);
        showErrorMessage(error);
    }
});

function showWelcomeMessage() {
    console.log('');
    console.log('🎮 Welcome to SOIL!');
    console.log('');
    console.log('This is an emergent mechanic game engine based on the 64 hexagrams of the I Ching.');
    console.log('Each hexagram you unlock adds new mechanics and possibilities to the game world.');
    console.log('');
    console.log('Controls:');
    console.log('• Arrow Keys or WASD: Move');
    console.log('• Space: Advance time / Idle (accumulate Ghïs points)');
    console.log('• R: Reset game');
    console.log('');
    console.log('Goal: Explore, collect Ghïs points, and unlock hexagrams to discover new mechanics!');
    console.log('');
    
    // Show a brief in-game notification
    showNotification('Welcome to SOIL! Move with arrow keys, press Space to idle and accumulate Ghïs.');
}

function addVersionInfo() {
    const versionInfo = document.createElement('div');
    versionInfo.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        font-size: 10px;
        color: #666;
        font-family: monospace;
        z-index: 1000;
    `;
    versionInfo.textContent = 'SOIL v1.0 - HTML/JS Port';
    document.body.appendChild(versionInfo);
}

function showErrorMessage(error) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #d32f2f;
        color: white;
        padding: 20px;
        border-radius: 8px;
        font-family: monospace;
        max-width: 500px;
        text-align: center;
        z-index: 10000;
    `;
    errorDiv.innerHTML = `
        <h2>🚫 Game Engine Error</h2>
        <p>Failed to initialize the SOIL game engine.</p>
        <p><strong>Error:</strong> ${error.message}</p>
        <button onclick="location.reload()" style="
            background: white;
            color: #d32f2f;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        ">Reload Page</button>
    `;
    document.body.appendChild(errorDiv);
}

function showNotification(message, duration = 5000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(42, 42, 54, 0.95);
        color: #e0e0e0;
        padding: 15px 25px;
        border-radius: 8px;
        border: 1px solid #4a4a5c;
        font-family: 'Courier New', monospace;
        max-width: 600px;
        text-align: center;
        z-index: 10000;
        animation: slideDown 0.5s ease-out;
    `;
    
    // Add slide down animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateX(-50%) translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.5s ease-in reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, duration);
}

// Global utilities for debugging and interaction
window.SOIL = {
    // Utility functions for console interaction
    showMap: () => window.renderer.renderASCII(),
    debugInfo: () => window.gameEngine.showDebugInfo(),
    exportState: () => window.gameEngine.exportGameState(),
    unlockHexagram: (name) => window.hexagramSystem.unlockHexagram(name),
    teleport: (x, y) => {
        const state = window.gameState;
        if (state.isValidPosition(x, y)) {
            state.player.x = x;
            state.player.y = y;
            window.renderer.render();
            window.timeSystem.updateTimeDisplay();
            console.log(`Teleported to ${x}, ${y}`);
        } else {
            console.log('Invalid position');
        }
    },
    addGhis: (amount) => {
        window.gameState.ghisPoints += amount;
        window.timeSystem.updateTimeDisplay();
        console.log(`Added ${amount} Ghïs points`);
    },
    reset: () => window.playerSystem.resetGame(),
    
    // Quick access to game systems
    get state() { return window.gameState; },
    get hexagrams() { return window.hexagramSystem; },
    get player() { return window.playerSystem; },
    get map() { return window.mapSystem; },
    get time() { return window.timeSystem; },
    get engine() { return window.gameEngine; },
    
    // Help
    help: () => {
        console.log('🌱 SOIL Console Commands:');
        console.log('SOIL.showMap() - Display ASCII map');
        console.log('SOIL.debugInfo() - Show debug information');
        console.log('SOIL.exportState() - Export game state');
        console.log('SOIL.unlockHexagram(name) - Unlock specific hexagram');
        console.log('SOIL.teleport(x, y) - Teleport player');
        console.log('SOIL.addGhis(amount) - Add Ghïs points');
        console.log('SOIL.reset() - Reset game');
        console.log('SOIL.state - Access game state');
        console.log('SOIL.hexagrams - Access hexagram system');
        console.log('SOIL.help() - Show this help');
    }
};

// Show help on first load
console.log('💡 Type SOIL.help() in the console for available commands');

// Performance monitoring
if (window.performance && window.performance.memory) {
    setInterval(() => {
        const memory = window.performance.memory;
        if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB threshold
            console.warn('High memory usage detected:', Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB');
        }
    }, 30000);
}

// Visibility change handler (pause/resume on tab switch)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('🌙 SOIL paused (tab hidden)');
        window.gameState.save();
    } else {
        console.log('☀️ SOIL resumed (tab visible)');
    }
});