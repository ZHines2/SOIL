# Testing Notes for Performance Improvements

## How to Test

### Testing in Browser (HTML Version)

1. **Open the game:**
   ```bash
   # Open index.html in your web browser
   firefox index.html
   # or
   chrome index.html
   ```

2. **Test tile state progression:**
   - Move around with arrow keys to create visited tiles
   - Stand still and press **Space** repeatedly (at least 25 times)
   - Observe tiles around you changing: ▒ → ░ → ▒ → ▓ → █ → ✹
   - The ripple should expand outward with each 5 idle ticks

3. **Test performance improvements:**
   - Move around to visit 50+ tiles
   - Notice smooth rendering even with many visited tiles
   - The game should remain responsive

4. **Test sprout mechanics:**
   - Move and meditate until you get 9+ Ghïs, 9+ Steps, 9+ Idle
   - Qián hexagram should unlock (䷀ appears in menu)
   - Sprouts (⚲) should appear on the map
   - Walk over sprouts to collect them (counter increases)
   - Collect 11 sprouts to unlock Kūn hexagram (䷁)
   - A 4x4 receptive zone (▓) should appear

5. **Test cycle progression:**
   - Continue playing until ticks reach 100
   - Cycle should increment and Xū hexagram (䷄) should unlock
   - Bottom progress bar should animate smoothly

### Testing GDScript Version (Godot)

If you have Godot installed:

1. Open the project in Godot Engine
2. Run the main scene
3. Test the same functionality as above using:
   - Arrow keys for movement
   - Space for idle/meditation

### Expected Behavior

#### Tile States
- **Initial**: All tiles show as ▒
- **Visited once**: Tiles remain ▒ until idle ticks accumulate
- **Idle ticks 5-9**: Tiles show ░
- **Idle ticks 10-14**: Tiles show ▒
- **Idle ticks 15-19**: Tiles show ▓
- **Idle ticks 20+**: Tiles show ✹ (fully activated)

#### Ripple Effect
- Ripple radius = floor(idle_ticks / 5)
- At 5 idle ticks: 1-tile radius
- At 10 idle ticks: 2-tile radius
- At 25 idle ticks: 5-tile radius
- Tiles in each ring should progress independently

#### Performance Metrics
With the optimizations, the game should handle:
- 100+ visited tiles: Smooth rendering
- 100+ sprouts: No lag when checking positions
- Ripple effect: Smooth state transitions

### Known Limitations

1. **Sprout spawning**: Sprouts can spawn on any tile, including already visited ones
2. **Receptive zone**: Only spawns after collecting exactly 11 sprouts
3. **Ripple effect**: Only activates after 5+ idle ticks accumulated

## Performance Comparison

### Before Optimizations
- Position checks: O(n) time complexity
- Rendering with 100 visited tiles: Noticeable slowdown
- Sprout collection: Linear search through all sprouts

### After Optimizations
- Position checks: O(1) time complexity
- Rendering with 100 visited tiles: No performance impact
- Sprout collection: Instant dictionary lookup

## Debugging

If issues occur:

1. **Check browser console** (F12) for JavaScript errors
2. **Verify tile state progression**:
   ```javascript
   // In browser console
   console.log(gameState.idleTicks);
   console.log(gameState.tileStateMap);
   ```

3. **Check Godot debug output** for GDScript version

## Regression Testing

Ensure these features still work correctly:
- [x] Player movement in all directions
- [x] Visited tile tracking
- [x] Steps counter increments
- [x] Idle ticks increment on Space press
- [x] Ghïs points accumulate
- [x] Hexagram unlocking conditions
- [x] Sprout spawning and collection
- [x] Receptive zone spawning
- [x] Cycle progression
- [x] Bottom progress bar animation
- [x] Menu display with all stats
