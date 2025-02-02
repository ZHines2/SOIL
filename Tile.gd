extends Node

class_name Tile

# Constants
const TILE_STATES = ["░", "▒", "▓", "█"]
const FULLY_ACTIVATED_GLYPH = "✹"

# Variables
var position = Vector2()
var state = TILE_STATES[0]
var idle_ticks = 0

# Initialize the tile
func _init(pos: Vector2):
	position = pos

# Update the tile's state based on idle ticks
func update_state():
	idle_ticks += 1
	if idle_ticks >= 20:
		state = FULLY_ACTIVATED_GLYPH
	else:
		var index = floor(idle_ticks / 5)
		if index < TILE_STATES.size():
			state = TILE_STATES[index]

# Get the current state of the tile
func get_state() -> String:
	return state
