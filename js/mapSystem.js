// Map system for world management
class MapSystem {
    constructor() {
        this.tileTextures = ["░", "▒", "▓", "█"]; // Tile states
        this.fullyActivatedGlyph = "✹";
        this.soilTexture = "▒";
        this.sproutTexture = "⚲";
        this.receptiveZoneTexture = "▓";
    }

    // Get the texture for a tile at given position
    getTileTexture(x, y) {
        const state = window.gameState;
        const posKey = state.positionKey(x, y);

        // Check for player position
        if (x === state.player.x && y === state.player.y) {
            return window.playerSystem.getTexture();
        }

        // Check for sprouts (if Qián is unlocked)
        if (state.hexagramQianUnlocked && state.sprouts.has(posKey)) {
            return this.sproutTexture;
        }

        // Check for receptive zones
        if (state.receptiveZones.has(posKey)) {
            return this.receptiveZoneTexture;
        }

        // Check if tile has been visited and has a state
        if (state.visitedTiles.has(posKey)) {
            const tileState = state.tileStates.get(posKey);
            if (tileState !== undefined) {
                if (tileState >= 4) {
                    return this.fullyActivatedGlyph;
                } else if (tileState >= 0 && tileState < this.tileTextures.length) {
                    return this.tileTextures[tileState];
                }
            }
            return this.soilTexture;
        }

        // Default soil texture for unvisited tiles
        return this.soilTexture;
    }

    // Get viewport bounds centered on player
    getViewportBounds() {
        const state = window.gameState;
        const viewportWidth = state.VIEWPORT_WIDTH;
        const viewportHeight = state.VIEWPORT_HEIGHT;

        let startX = Math.max(0, state.player.x - Math.floor(viewportWidth / 2));
        let startY = Math.max(0, state.player.y - Math.floor(viewportHeight / 2));
        let endX = Math.min(state.MAP_WIDTH, startX + viewportWidth);
        let endY = Math.min(state.MAP_HEIGHT, startY + viewportHeight);

        // Adjust start coordinates if we hit the edge
        startX = Math.max(0, endX - viewportWidth);
        startY = Math.max(0, endY - viewportHeight);

        return {
            startX,
            startY,
            endX,
            endY,
            width: endX - startX,
            height: endY - startY
        };
    }

    // Generate ASCII representation of the viewport
    generateViewportASCII() {
        const bounds = this.getViewportBounds();
        let output = '';

        for (let y = bounds.startY; y < bounds.endY; y++) {
            let row = '';
            for (let x = bounds.startX; x < bounds.endX; x++) {
                row += this.getTileTexture(x, y);
            }
            output += row + '\n';
        }

        return output;
    }

    // Get world data for rendering systems
    getViewportData() {
        const bounds = this.getViewportBounds();
        const data = [];

        for (let y = bounds.startY; y < bounds.endY; y++) {
            const row = [];
            for (let x = bounds.startX; x < bounds.endX; x++) {
                row.push({
                    x: x,
                    y: y,
                    texture: this.getTileTexture(x, y),
                    isPlayer: (x === window.gameState.player.x && y === window.gameState.player.y),
                    isSprout: window.gameState.sprouts.has(window.gameState.positionKey(x, y)),
                    isReceptiveZone: window.gameState.receptiveZones.has(window.gameState.positionKey(x, y)),
                    isVisited: window.gameState.visitedTiles.has(window.gameState.positionKey(x, y)),
                    tileState: window.gameState.tileStates.get(window.gameState.positionKey(x, y)) || 0
                });
            }
            data.push(row);
        }

        return {
            bounds: bounds,
            data: data
        };
    }

    // Check if a position is blocked (for future use)
    isBlocked(x, y) {
        // For now, no tiles are blocked
        // Could add obstacles, walls, etc. in the future
        return false;
    }

    // Get distance between two points
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    // Get all positions within a radius
    getPositionsInRadius(centerX, centerY, radius) {
        const positions = [];
        const state = window.gameState;

        for (let y = centerY - radius; y <= centerY + radius; y++) {
            for (let x = centerX - radius; x <= centerX + radius; x++) {
                if (state.isValidPosition(x, y)) {
                    const distance = this.getDistance(centerX, centerY, x, y);
                    if (distance <= radius) {
                        positions.push({ x, y, distance });
                    }
                }
            }
        }

        return positions;
    }

    // Find nearest sprout to player
    findNearestSprout() {
        const state = window.gameState;
        const playerX = state.player.x;
        const playerY = state.player.y;
        let nearest = null;
        let minDistance = Infinity;

        for (const [posKey, sprout] of state.sprouts) {
            const distance = this.getDistance(playerX, playerY, sprout.x, sprout.y);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = { ...sprout, distance };
            }
        }

        return nearest;
    }

    // Get all sprouts in viewport
    getSproutsInViewport() {
        const bounds = this.getViewportBounds();
        const sprouts = [];

        for (const [posKey, sprout] of window.gameState.sprouts) {
            if (sprout.x >= bounds.startX && sprout.x < bounds.endX &&
                sprout.y >= bounds.startY && sprout.y < bounds.endY) {
                sprouts.push(sprout);
            }
        }

        return sprouts;
    }

    // Debug method to log map state
    logMapState() {
        console.log('=== MAP STATE ===');
        console.log('Player:', window.gameState.player);
        console.log('Visited tiles:', window.gameState.visitedTiles.size);
        console.log('Sprouts:', window.gameState.sprouts.size);
        console.log('Receptive zones:', window.gameState.receptiveZones.size);
        console.log('Tile states:', window.gameState.tileStates.size);
        console.log('================');
    }
}

// Global map system instance
window.mapSystem = new MapSystem();