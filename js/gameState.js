// Core game state management
class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        // Player state
        this.player = {
            x: 50,
            y: 50,
            stepsTaken: 0
        };

        // Time and progression
        this.time = {
            ticks: 0,
            cycles: 0,
            idleTicks: 0,
            ticksPerCycle: 100
        };

        // Resources and progression
        this.ghisPoints = 0;
        this.unlockedHexagrams = [];
        this.sprouts = new Map(); // position -> sprout data
        this.sproutCount = 0;
        this.receptiveZones = new Set(); // positions of receptive zones

        // Map state
        this.visitedTiles = new Set();
        this.tileStates = new Map(); // position -> state index
        this.tileIdleTicks = new Map(); // position -> idle tick count

        // Flags
        this.hexagramQianUnlocked = false;
        this.receptiveZoneSpawned = false;
        this.musicPlayed = false;

        // Constants
        this.MAP_WIDTH = 100;
        this.MAP_HEIGHT = 100;
        this.VIEWPORT_WIDTH = 40;
        this.VIEWPORT_HEIGHT = 20;
        this.MAX_SPROUTS = 111;
        this.SPAWN_INTERVAL = 10;
    }

    // Utility methods for position handling
    positionKey(x, y) {
        return `${x},${y}`;
    }

    parsePosition(key) {
        const [x, y] = key.split(',').map(Number);
        return { x, y };
    }

    isValidPosition(x, y) {
        return x >= 0 && x < this.MAP_WIDTH && y >= 0 && y < this.MAP_HEIGHT;
    }

    // Save and load state
    save() {
        const state = {
            player: this.player,
            time: this.time,
            ghisPoints: this.ghisPoints,
            unlockedHexagrams: this.unlockedHexagrams,
            sprouts: Array.from(this.sprouts.entries()),
            sproutCount: this.sproutCount,
            receptiveZones: Array.from(this.receptiveZones),
            visitedTiles: Array.from(this.visitedTiles),
            tileStates: Array.from(this.tileStates.entries()),
            tileIdleTicks: Array.from(this.tileIdleTicks.entries()),
            hexagramQianUnlocked: this.hexagramQianUnlocked,
            receptiveZoneSpawned: this.receptiveZoneSpawned,
            musicPlayed: this.musicPlayed
        };
        localStorage.setItem('soil_game_state', JSON.stringify(state));
    }

    load() {
        const saved = localStorage.getItem('soil_game_state');
        if (!saved) return false;

        try {
            const state = JSON.parse(saved);
            this.player = state.player;
            this.time = state.time;
            this.ghisPoints = state.ghisPoints;
            this.unlockedHexagrams = state.unlockedHexagrams || [];
            this.sprouts = new Map(state.sprouts || []);
            this.sproutCount = state.sproutCount || 0;
            this.receptiveZones = new Set(state.receptiveZones || []);
            this.visitedTiles = new Set(state.visitedTiles || []);
            this.tileStates = new Map(state.tileStates || []);
            this.tileIdleTicks = new Map(state.tileIdleTicks || []);
            this.hexagramQianUnlocked = state.hexagramQianUnlocked || false;
            this.receptiveZoneSpawned = state.receptiveZoneSpawned || false;
            this.musicPlayed = state.musicPlayed || false;
            return true;
        } catch (e) {
            console.error('Failed to load game state:', e);
            return false;
        }
    }
}

// Global game state instance
window.gameState = new GameState();