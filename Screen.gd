extends Node

# Global debug flag
var DEBUG_MODE = true

# Constants
const MAP_WIDTH = 100
const MAP_HEIGHT = 100
const VIEWPORT_WIDTH = 40
const VIEWPORT_HEIGHT = 20
const SOIL_TEXTURE = "▒"
const PLAYER_TEXTURE = "𐍈"
const SPROUT_TEXTURE = "⚲"  # Neuter symbol
const RECEPTIVE_ZONE_TEXTURE = "▓"  # Texture for receptive zone
const MAX_SPROUTS = 111  # Maximum number of sprouts

# Variables
var player_position = Vector2(50, 50)
var steps_taken = 0
var visited_tiles = []
var steps_symbol = "→"
var coords_symbol = "𓀇"
var ticks = 0
var cycles = 0
var idle_ticks = 0  # Track the number of idle ticks
var ghis_points = 0  # Accumulate Ghïs points
var unlocked_hexagrams = []  # Track unlocked hexagrams
var sprouts = []  # List to hold sprout positions
var sprout_count = 0  # Counter for the sprouts collected
var hexagram_qian_unlocked = false  # Track if Qián is unlocked
var receptive_zone_spawned = false  # Tracks if the receptive zone has been spawned
var receptive_zone = []  # List to hold receptive zone positions

var tile_states = ["░", "▒", "▓", "█"]  # Define 4 unique tile states
var tile_state_map = {}  # Dictionary to track the state of each tile
var tile_idle_map = {}  # Dictionary to track idle ticks for each tile
var cycle_symbols = ["⨀", "⨁", "⨂", "⨃", "⨄", "⨅", "⨆", "⨇", "⨈", "⨉"]
var ticks_per_cycle = 100
var gradient_chars = ["░", "▒", "▓", "█"]  # Ensure gradient_chars is declared
var special_char = "✶"  # Special character for the middle of the gradient
var fully_activated_glyph = "✹"  # Glyph to indicate a fully activated tile

# Initialize the screen
func initialize_screen():
	render_viewport()

# Conditional debug print function
func debug_print(message):
	if DEBUG_MODE:
		print(message)

# Move the player and update the state
func move_player(direction):
	var new_position = player_position + direction
	if new_position.x >= 0 and new_position.x < MAP_WIDTH and new_position.y >= 0 and new_position.y < MAP_HEIGHT:
		if player_position not in visited_tiles:
			visited_tiles.append(player_position)
		player_position = new_position
		steps_taken += 1  # Increment steps taken
		
		if hexagram_qian_unlocked:
			# Check if the player is on a sprout
			if _is_sprout(player_position):
				collect_sprout(player_position)
		
		render_viewport()

# Render the current viewport centered around the player
func render_viewport():
	var viewport_start_x = max(0, player_position.x - VIEWPORT_WIDTH / 2)
	var viewport_start_y = max(0, player_position.y - VIEWPORT_HEIGHT / 2)
	var viewport_end_x = min(MAP_WIDTH, viewport_start_x + VIEWPORT_WIDTH)
	var viewport_end_y = min(MAP_HEIGHT, viewport_start_y + VIEWPORT_HEIGHT)
	viewport_start_x = max(0, viewport_end_x - VIEWPORT_WIDTH)
	viewport_start_y = max(0, viewport_end_y - VIEWPORT_HEIGHT)

	var output = ""
	var menu_output = generate_menu_output().split("\n")

	for y in range(viewport_start_y, viewport_end_y):
		var row = ""
		for x in range(viewport_start_x, viewport_end_x):
			var position = Vector2(x, y)
			if position == player_position:
				row += PLAYER_TEXTURE
			elif position in visited_tiles:
				if tile_state_map.has(position):
					row += tile_state_map[position]
				else:
					row += SOIL_TEXTURE
			elif hexagram_qian_unlocked and _is_sprout(position):
				row += SPROUT_TEXTURE  # Neuter symbol
			elif _is_receptive_zone(position):
				row += RECEPTIVE_ZONE_TEXTURE
			else:
				row += SOIL_TEXTURE
		
		if y - viewport_start_y < menu_output.size():
			row += "  " + menu_output[y - viewport_start_y]

		output += row + "\n"

	# Only add the gradient border without redundant debug info
	output += generate_bottom_border()
	debug_print(output)

# Generate menu output on the right side of the viewport
func generate_menu_output() -> String:
	var output = ""
	output += "| %s %d \n" % [steps_symbol, steps_taken]
	output += "| %s (%03d, %03d) \n" % [coords_symbol, player_position.x, player_position.y]
	output += "| Cycle: %s Ticks: %d\n" % [cycle_symbols[cycles], ticks]
	output += "| Ghïs: %s %d\n" % ["𐎀", ghis_points]  # Using an ancient symbol to represent Ghïs points
	output += "| Idle: %s %d\n" % ["✜", idle_ticks]  # Using the cross symbol to represent idle ticks
	if hexagram_qian_unlocked:
		output += "| %s %d\n" % [SPROUT_TEXTURE, sprout_count]  # Displaying the neuter symbol and the count
	output += "|" + "─".repeat(20) + "\n"
	output += generate_unlocked_hexagrams()  # Add unlocked hexagrams to the menu
	return output

# Generate unlocked hexagrams display
func generate_unlocked_hexagrams() -> String:
	var output = "| Unlocked Hexagrams: \n"
	for hexagram in unlocked_hexagrams:
		output += "| %s\n" % [hexagram["unicode"]]  # Display only the symbol
	return output

# Generate a bottom border with a scrolling ASCII gradient
func generate_bottom_border() -> String:
	var total_chars = VIEWPORT_WIDTH
	var gradient = ""
	
	var progress = float(ticks % ticks_per_cycle) / float(ticks_per_cycle)
	var chars_to_fill = int(progress * total_chars)

	for i in range(total_chars):
		if i == total_chars / 2:
			gradient += special_char  # Place special_char at the middle
		else:
			var distance_to_middle = abs(i - total_chars / 2)
			var max_distance = total_chars / 2
			var gradient_index = int((1 - float(distance_to_middle) / max_distance) * (gradient_chars.size() - 1))
			if i < chars_to_fill:
				gradient += gradient_chars[gradient_index]
			else:
				gradient += gradient_chars[0]

	return gradient

# Update tile states based on idle ticks and propagate the ripple effect
func update_tile_states():
	return

# Check unlock conditions for hexagrams
func check_unlock_conditions():
	if ghis_points >= 9 and steps_taken >= 9 and idle_ticks >= 9:
		unlock_hexagram("Qián")

# Unlock a hexagram
func unlock_hexagram(hexagram_name):
	var hexagrams = [
		{"name": "Qián", "unicode": "䷀", "meaning": "The Creative"},
		{"name": "Kūn", "unicode": "䷁", "meaning": "The Receptive"}  # Add more hexagrams here if needed
	]
	for hexagram in hexagrams:
		if hexagram["name"] == hexagram_name and hexagram not in unlocked_hexagrams:
			unlocked_hexagrams.append(hexagram)
			if hexagram_name == "Qián":
				hexagram_qian_unlocked = true
				initialize_sprout_mechanics()
			elif hexagram_name == "Kūn":
				spawn_receptive_zone()
			break
	render_viewport()

# Initialize sprout mechanics once Qián is unlocked
func initialize_sprout_mechanics():
	# Reset or initialize variables related to sprouts
	sprouts.clear()
	sprout_count = 0
	# Optionally, spawn initial sprouts
	for i in range(10):  # Spawn 10 initial sprouts as an example
		spawn_sprout()

# Spawn a sprout at random coordinates
func spawn_sprout():
	if sprouts.size() >= MAX_SPROUTS:  # Check if max sprouts are reached
		return
	var x = randi() % MAP_WIDTH
	var y = randi() % MAP_HEIGHT
	var position = Vector2(x, y)
	
	# Add the sprout to the list of sprouts
	sprouts.append(position)

	# Update the viewport to display the new sprout
	render_viewport()

# Check if a position has a sprout
func _is_sprout(position: Vector2) -> bool:
	return position in sprouts

# Collect a sprout at the given position
func collect_sprout(position: Vector2):
	if position in sprouts:
		sprouts.erase(position)
		sprout_count += 1  # Increment sprout count

		# Check if 11 sprouts have been collected and the receptive zone hasn't been spawned yet
		if sprout_count == 11 and not receptive_zone_spawned:
			unlock_hexagram("Kūn")

	render_viewport()

# Spawn a receptive zone at a random unoccupied location
func spawn_receptive_zone():
	while true:
		var x = randi() % (MAP_WIDTH - 3)
		var y = randi() % (MAP_HEIGHT - 3)
		var new_zone = [
			Vector2(x, y), Vector2(x + 1, y), Vector2(x + 2, y), Vector2(x + 3, y),
			Vector2(x, y + 1), Vector2(x + 1, y + 1), Vector2(x + 2, y + 1), Vector2(x + 3, y + 1),
			Vector2(x, y + 2), Vector2(x + 1, y + 2), Vector2(x + 2, y + 2), Vector2(x + 3, y + 2),
			Vector2(x, y + 3), Vector2(x + 1, y + 3), Vector2(x + 2, y + 3), Vector2(x + 3, y + 3)
		]

		# Check if the selected zone is unoccupied
		var occupied = false
		for pos in new_zone:
			if _is_sprout(pos) or _is_receptive_zone(pos):
				occupied = true
				break

		if not occupied:
			receptive_zone = new_zone
			receptive_zone_spawned = true
			print("A receptive zone has appeared at (%d, %d)" % [x, y])
			break

	render_viewport()

# Check if a position is part of a receptive zone
func _is_receptive_zone(position: Vector2) -> bool:
	return position in receptive_zone

# Update sprouts for decay
func update_sprouts():
	# Placeholder for sprout decay logic if needed
	render_viewport()
