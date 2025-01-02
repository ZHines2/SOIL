extends Node

# Constants
var map_width = 100
var map_height = 100
var viewport_width = 40
var viewport_height = 20
var soil_texture = "▒"
var player_texture = "𐍈"

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

# Move the player and update the state
func move_player(direction):
	var new_position = player_position + direction
	if new_position.x >= 0 and new_position.x < map_width and new_position.y >= 0 and new_position.y < map_height:
		if player_position not in visited_tiles:
			visited_tiles.append(player_position)
		player_position = new_position
		steps_taken += 1  # Increment steps taken
		render_viewport()

# Render the current viewport centered around the player
func render_viewport():
	var viewport_start_x = max(0, player_position.x - viewport_width / 2)
	var viewport_start_y = max(0, player_position.y - viewport_height / 2)
	var viewport_end_x = min(map_width, viewport_start_x + viewport_width)
	var viewport_end_y = min(map_height, viewport_start_y + viewport_height)
	viewport_start_x = max(0, viewport_end_x - viewport_width)
	viewport_start_y = max(0, viewport_end_y - viewport_height)

	var output = ""
	var menu_output = generate_menu_output().split("\n")

	for y in range(viewport_start_y, viewport_end_y):
		var row = ""
		for x in range(viewport_start_x, viewport_end_x):
			var position = Vector2(x, y)
			if position == player_position:
				row += player_texture
			elif position in visited_tiles:
				if tile_state_map.has(position):
					row += tile_state_map[position]
				else:
					row += soil_texture
			else:
				row += soil_texture
		
		if y - viewport_start_y < menu_output.size():
			row += "  " + menu_output[y - viewport_start_y]

		output += row + "\n"

	print(output + generate_bottom_border())

# Generate menu output on the right side of the viewport
func generate_menu_output() -> String:
	var output = ""
	output += "| %s %d \n" % [steps_symbol, steps_taken]
	output += "| %s (%03d, %03d) \n" % [coords_symbol, player_position.x, player_position.y]
	output += "| Cycle: %s Ticks: %d\n" % [cycle_symbols[cycles], ticks]
	output += "| Ghïs: %s %d\n" % ["𐎀", ghis_points]  # Using an ancient symbol to represent Ghïs points
	output += "| Idle: %s %d\n" % ["✜", idle_ticks]  # Using the cross symbol to represent idle ticks
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
	var total_chars = viewport_width
	var gradient = ""
	
	var progress = float(ticks % ticks_per_cycle) / float(ticks_per_cycle)
	var chars_to_fill = int(progress * total_chars)

	for i in range(total_chars):
		if i == total_chars / 2:
			gradient += special_char
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
	# Ripple effect is turned off by returning early
	return

# Check unlock conditions for hexagrams
func check_unlock_conditions():
	if ghis_points >= 9 and steps_taken >= 9 and idle_ticks >= 9:
		unlock_hexagram("Qián")

# Unlock a hexagram
func unlock_hexagram(hexagram_name):
	var hexagrams = [
		{"name": "Qián", "unicode": "䷀", "meaning": "The Creative"}  # Add more hexagrams here if needed
	]
	for hexagram in hexagrams:
		if hexagram["name"] == hexagram_name and hexagram not in unlocked_hexagrams:
			unlocked_hexagrams.append(hexagram)
			break
	render_viewport()
