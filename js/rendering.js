// Canvas-based rendering system
class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.tileSize = 16; // Size of each tile in pixels
        this.fontSize = 14;
        
        // Color scheme
        this.colors = {
            background: '#000000',
            soil: '#4a4a3a',
            player: '#f0c674',
            sprout: '#b5bd68',
            receptiveZone: '#8abeb7',
            visitedTile: '#2a2a2a',
            tileState0: '#333333',
            tileState1: '#444444',
            tileState2: '#555555',
            tileState3: '#666666',
            fullyActivated: '#81a2be',
            border: '#4a4a5c',
            text: '#e0e0e0'
        };

        this.setupCanvas();
        this.initializeRendering();
    }

    setupCanvas() {
        // Set canvas size based on viewport
        const state = window.gameState;
        this.canvas.width = state.VIEWPORT_WIDTH * this.tileSize;
        this.canvas.height = state.VIEWPORT_HEIGHT * this.tileSize;
        
        // Set up text rendering
        this.ctx.font = `${this.fontSize}px monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
    }

    initializeRendering() {
        // Initial render
        this.render();
        console.log('Renderer initialized');
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Get viewport data from map system
        const viewportData = window.mapSystem.getViewportData();
        
        // Render tiles
        this.renderTiles(viewportData);
        
        // Render border
        this.renderBorder();
    }

    renderTiles(viewportData) {
        const { data } = viewportData;
        
        data.forEach((row, rowIndex) => {
            row.forEach((tile, colIndex) => {
                const x = colIndex * this.tileSize;
                const y = rowIndex * this.tileSize;
                
                // Determine tile color and character
                let color = this.colors.soil;
                let character = tile.texture;
                
                if (tile.isPlayer) {
                    color = this.colors.player;
                } else if (tile.isSprout && window.gameState.hexagramQianUnlocked) {
                    color = this.colors.sprout;
                } else if (tile.isReceptiveZone) {
                    color = this.colors.receptiveZone;
                } else if (tile.isVisited) {
                    if (tile.tileState >= 4) {
                        color = this.colors.fullyActivated;
                    } else if (tile.tileState >= 0 && tile.tileState <= 3) {
                        color = this.colors[`tileState${tile.tileState}`];
                    } else {
                        color = this.colors.visitedTile;
                    }
                }
                
                // Render tile background
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
                
                // Render character
                this.ctx.fillStyle = this.colors.text;
                this.ctx.fillText(
                    character, 
                    x + this.tileSize / 2, 
                    y + this.tileSize / 2
                );
            });
        });
    }

    renderBorder() {
        this.ctx.strokeStyle = this.colors.border;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Alternative ASCII-based rendering for debugging
    renderASCII() {
        const ascii = window.mapSystem.generateViewportASCII();
        console.log('\n' + ascii);
    }

    // Resize canvas if needed
    resize() {
        this.setupCanvas();
        this.render();
    }

    // Flash effect for special events
    flashEffect(color = '#ffffff', duration = 200) {
        const originalStyle = this.canvas.style.filter;
        this.canvas.style.filter = `drop-shadow(0 0 10px ${color})`;
        
        setTimeout(() => {
            this.canvas.style.filter = originalStyle;
        }, duration);
    }

    // Highlight a specific tile (for effects)
    highlightTile(worldX, worldY, color = '#ffffff', duration = 1000) {
        const bounds = window.mapSystem.getViewportBounds();
        
        // Check if tile is in viewport
        if (worldX >= bounds.startX && worldX < bounds.endX &&
            worldY >= bounds.startY && worldY < bounds.endY) {
            
            const tileX = (worldX - bounds.startX) * this.tileSize;
            const tileY = (worldY - bounds.startY) * this.tileSize;
            
            // Save current state
            this.ctx.save();
            
            // Draw highlight
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(tileX, tileY, this.tileSize, this.tileSize);
            
            // Restore state after duration
            setTimeout(() => {
                this.render(); // Re-render to remove highlight
            }, duration);
            
            this.ctx.restore();
        }
    }

    // Get mouse position relative to world coordinates
    getWorldPositionFromMouse(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        const tileX = Math.floor(mouseX / this.tileSize);
        const tileY = Math.floor(mouseY / this.tileSize);
        
        const bounds = window.mapSystem.getViewportBounds();
        const worldX = bounds.startX + tileX;
        const worldY = bounds.startY + tileY;
        
        return { worldX, worldY, tileX, tileY };
    }

    // Add mouse interaction
    initializeMouseEvents() {
        this.canvas.addEventListener('click', (event) => {
            const pos = this.getWorldPositionFromMouse(event);
            console.log(`Clicked tile at world position: ${pos.worldX}, ${pos.worldY}`);
            
            // Could add click interactions here
            // For example, teleport player, place markers, etc.
        });

        this.canvas.addEventListener('mousemove', (event) => {
            // Could show tile information on hover
            const pos = this.getWorldPositionFromMouse(event);
            this.canvas.title = `World: ${pos.worldX}, ${pos.worldY}`;
        });
    }

    // Performance monitoring
    startPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const monitor = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                console.log(`Renderer FPS: ${frameCount}`);
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(monitor);
        };
        
        monitor();
    }
}

// Global renderer instance
window.renderer = null;