# Performance Improvements

## Changes Made

### 1. Dictionary-Based Position Tracking
**Problem**: The original code used `position in visited_tiles` which is O(n) lookup time.
**Solution**: Added `visited_tiles_dict` for O(1) lookups using position as key.

**Impact**: Significant performance improvement when checking if positions have been visited, especially as the player explores more of the map.

### 2. Implemented Tile State Progression
**Problem**: The `update_tile_states()` function in Screen.gd was empty, so tiles never changed state.
**Solution**: Integrated the Ripple.gd mechanics to properly update tile states based on idle ticks.

**Impact**: Tiles now visually progress through states (░ → ▒ → ▓ → █ → ✹) as the player remains idle, creating the intended ripple effect.

### 3. Ripple Effect Integration
**Problem**: Ripple.gd existed but wasn't being used by Screen.gd.
**Solution**: 
- Initialize Ripple instance in Screen.gd
- Call ripple.update_tile_states() when player idles
- Sync tile state maps between Ripple and Screen

**Impact**: The ripple effect now works as intended, propagating outward from the player position during meditation.

### 4. HTML Version Synchronization
**Problem**: HTML version had similar performance issues and missing functionality.
**Solution**: 
- Implemented updateTileStates() function with ripple logic
- Added visitedTilesDict for fast lookups
- Integrated tile state updates on space bar press (meditation)

**Impact**: HTML version now has feature parity with GDScript version.

### 5. Optimized Sprout and Receptive Zone Lookups
**Problem**: `_is_sprout()` and `_is_receptive_zone()` used O(n) array searches.
**Solution**: 
- Added sprouts_dict and receptive_zone_dict for O(1) lookups
- Updated all position checks to use dictionaries
- Synchronized both array and dictionary when adding/removing entities

**Impact**: Constant-time position lookups for sprouts and receptive zones, regardless of count.

## How It Works

### Tile State Progression
When the player presses space (idle/meditate):
1. `idle_ticks` increments
2. If `idle_ticks >= 5`, ripple effect activates
3. Radius = floor(idle_ticks / 5) - each 5 ticks extends radius by 1
4. All tiles within the radius ring get updated:
   - Tile idle counter increments
   - Tile state updates based on its idle count:
     - 0-4 ticks: "░"
     - 5-9 ticks: "▒"
     - 10-14 ticks: "▓"
     - 15-19 ticks: "█"
     - 20+ ticks: "✹" (fully activated)

### Performance Optimization
- **Before**: Checking if a position was visited required iterating through entire visited_tiles array
- **After**: Position lookup is instant using dictionary key

Example impact for 100 visited tiles:
- Before: Up to 100 comparisons per tile check
- After: 1 hash lookup per tile check

Similar improvements apply to sprout and receptive zone lookups:
- With 100 sprouts on map: 100x faster position checks
- With 16 receptive zone tiles: 16x faster position checks

## Testing
To test the improvements:
1. Open index.html in a web browser
2. Move around to create some visited tiles
3. Stand still and press Space repeatedly
4. Watch tiles around you progress through visual states
5. Notice the ripple expanding outward as idle_ticks increases
