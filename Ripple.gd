extends Node

class_name Ripple

# Constants and variables
const TILE_STATES = ["░", "▒", "▓", "█"]
const FULLY_ACTIVATED_GLYPH = "✹"

var tile_state_map = {}  # Dictionary to track the state of each tile
var tile_idle_map = {}  # Dictionary to track idle ticks for each tile

# Update tile states based on idle ticks and propagate the ripple effect
func update_tile_states(center: Vector2, idle_ticks: int, map_width: int, map_height: int, visited_tiles: Array):
	if idle_ticks < 5:
		return

	var radius = floor(idle_ticks / 5)  # Each 5 idle ticks increase the radius by 1

	for r in range(1, radius + 1):
		if idle_ticks >= r * 5:
			for y in range(center.y - r, center.y + r + 1):
				for x in range(center.x - r, center.x + r + 1):
					var position = Vector2(x, y)
					if position.x >= 0 and position.x < map_width and position.y >= 0 and position.y < map_height:
						var distance = center.distance_to(position)
						# Include diagonals by considering positions exactly r units away
						if distance <= float(r) and distance > float(r - 1):
							# Initialize idle ticks for the tile if not already done
							if not tile_idle_map.has(position):
								tile_idle_map[position] = 0

							tile_idle_map[position] += 1
							if tile_idle_map[position] >= 20:
								tile_state_map[position] = FULLY_ACTIVATED_GLYPH
							else:
								var state_index = floor(tile_idle_map[position] / 5)
								tile_state_map[position] = TILE_STATES[state_index]

							visited_tiles.append(position)  # Mark the tile as visited
