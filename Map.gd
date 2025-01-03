extends Node

class_name Map

# Constants
const MAP_WIDTH = 100
const MAP_HEIGHT = 100
const VIEWPORT_WIDTH = 40
const VIEWPORT_HEIGHT = 20
const SOIL_TEXTURE = "▒"
const TILE_STATES = ["░", "▒", "▓", "█"]
const GRADIENT_CHARS = ["░", "▒", "▓", "█"]
const SPECIAL_CHAR = "✶"
const FULLY_ACTIVATED_GLYPH = "✹"
const CYCLE_SYMBOLS = ["⨀", "⨁", "⨂", "⨃", "⨄", "⨅", "⨆", "⨇", "⨈", "⨉"]
const TICKS_PER_CYCLE = 100

# Variables
var tiles = {}
var visited_tiles = []
var player  # Reference to the player instance

# Initialize the map with tiles
func initialize_map():
	for x in range(MAP_WIDTH):
		for y in range(MAP_HEIGHT):
			var tile = Tile.new(Vector2(x, y))
			tiles[Vector2(x, y)] = tile

# Update the state of tiles within a specific radius of the center
func update_tiles(center: Vector2, radius: int):
	for y in range(center.y - radius, center.y + radius + 1):
		for x in range(center.x - radius, center.x + radius + 1):
			var position = Vector2(x, y)
			if tiles.has(position) and center.distance_to(position) <= float(radius):
				tiles[position].update_state()

# Get the state of a specific tile
func get_tile_state(position: Vector2) -> String:
	if tiles.has(position):
		return tiles[position].get_state()
	return SOIL_TEXTURE

# Render the current viewport centered around the player
func render_viewport(player_position: Vector2, sprouts: Dictionary, sprout_texture: String):
	var viewport_start_x = max(0, player_position.x - VIEWPORT_WIDTH / 2)
	var viewport_start_y = max(0, player_position.y - VIEWPORT_HEIGHT / 2)
	var viewport_end_x = min(MAP_WIDTH, viewport_start_x + VIEWPORT_WIDTH)
	var viewport_end_y = min(MAP_HEIGHT, viewport_start_y + VIEWPORT_HEIGHT)
	viewport_start_x = max(0, viewport_end_x - VIEWPORT_WIDTH)
	viewport_start_y = max(0, viewport_end_y - VIEWPORT_HEIGHT)

	var output = ""

	for y in range(viewport_start_y, viewport_end_y):
		var row = ""
		for x in range(viewport_start_x, viewport_end_x):
			var position = Vector2(x, y)
			if position == player_position:
				row += player.get_texture()
			elif sprouts.has(position):  # Display sprout if present
				row += sprout_texture
			elif visited_tiles.has(position):
				row += get_tile_state(position)
			else:
				row += SOIL_TEXTURE
		output += row + "\n"

	print(output)
