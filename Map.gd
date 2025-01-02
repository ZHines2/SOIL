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


# Initialize the map with tiles
func _ready():
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
