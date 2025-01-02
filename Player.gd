extends Node2D

@export var player_position: Vector2 = Vector2.ZERO
@export var steps_taken: int = 0

# Function to move the player one step at a time
func move(direction: Vector2, map: Node):
	var new_position = player_position + direction

	# Check if the new position is within the map bounds and not blocked
	if new_position.x >= 0 and new_position.x < map.MAP_WIDTH and new_position.y >= 0 and new_position.y < map.MAP_HEIGHT:
		if not map.is_blocked(new_position):
			player_position = new_position
			steps_taken += 1

# Function to get the player's texture
func get_texture() -> String:
	return "@"  # ASCII character for the player
