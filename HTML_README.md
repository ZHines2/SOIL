# SOIL - HTML Version

This is a web-based version of the SOIL (Emergent Mechanic Game Engine) that runs directly in your browser without requiring the Godot engine.

## Quick Start

Simply open `index.html` in any modern web browser. No installation, server, or dependencies required!

## Controls

- **Arrow Keys**: Move your player character (𐍈) around the map
- **Space Bar**: Meditate/idle to gain Ghïs points and increase idle ticks

## Game Mechanics

### Basic Stats
- **Steps (→)**: Count of moves you've made
- **Coordinates (𓀇)**: Your current position on the 100x100 map
- **Cycle**: Current cycle symbol (⨀ through ⨉)
- **Ticks**: Progress through the current cycle (0-99)
- **Ghïs (𐎀)**: Points accumulated through meditation
- **Idle (✜)**: Consecutive idle ticks

### Unlocking Hexagrams

Hexagrams unlock when you meet certain conditions:

1. **Qián (䷀) - The Creative**: Unlocks at 9+ Ghïs, 9+ Steps, 9+ Idle ticks
   - Enables sprout spawning mechanics
   - Sprouts (⚲) appear randomly on the map
   - Collect sprouts by walking over them

2. **Kūn (䷁) - The Receptive**: Unlocks after collecting 11 sprouts
   - Spawns a 4x4 receptive zone (▓) on the map

3. **Xū (䷄) - Waiting**: Unlocks when the first cycle completes (100 ticks)

### Map Symbols

- **𐍈**: Your player character
- **▒**: Unvisited soil tiles
- **░▒▓█**: Visited tiles in various states
- **⚲**: Sprouts (collectible after unlocking Qián)
- **▓**: Receptive zone (appears after unlocking Kūn)
- **✶**: Special character in the progress gradient

## Game Features

- **100x100 tile map** with a 40x20 viewport that follows your character
- **Cycle system** with 100 ticks per cycle and 10 unique cycle symbols
- **Dynamic progress bar** at the bottom showing cycle completion
- **Real-time stats** displayed in the side menu
- **Hexagram progression system** inspired by the I Ching
- **Emergent gameplay** through the interaction of movement and meditation

## Tips

1. Start by moving around to explore the map (increases Steps)
2. Press Space repeatedly to gain Ghïs points (increases Idle)
3. Balance movement and meditation to unlock Qián hexagram
4. Once Qián is unlocked, collect sprouts to unlock Kūn
5. Watch the progress bar fill up as you approach the next cycle

## Technical Details

- Pure HTML/CSS/JavaScript implementation
- No external dependencies
- Runs entirely client-side
- Preserves all game mechanics from the original GDScript version
- Responsive ASCII art rendering with proper Unicode support

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript
- Unicode characters (for special symbols)
- CSS3

Tested in: Chrome, Firefox, Safari, Edge

---

Enjoy exploring the emergent mechanics of SOIL!
