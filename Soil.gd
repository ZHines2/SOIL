extends Node

@onready var screen = preload("res://Screen.gd").new()
@onready var time = preload("res://Time.gd").new()
@onready var player = preload("res://Player.gd").new()

var idle_ticks = 0  # Track the number of idle ticks
var ghis_points = 0  # Accumulate Ghïs points
var spawn_interval = 10  # Interval of ticks to spawn a sprout
var max_sprouts = 100  # Max number of sprouts on screen

func _ready():
	add_child(screen)
	add_child(time)
	add_child(player)
	screen.initialize_screen()
	time.connect("tick_updated", Callable(self, "_on_tick_updated"))
	player.set_screen(screen)  # Set the Screen reference in the Player object

func _input(event):
	var direction = Vector2.ZERO

	if Input.is_action_just_pressed("ui_up"):
		direction = Vector2(0, -1)
	elif Input.is_action_just_pressed("ui_down"):
		direction = Vector2(0, 1)
	elif Input.is_action_just_pressed("ui_left"):
		direction = Vector2(-1, 0)
	elif Input.is_action_just_pressed("ui_right"):
		direction = Vector2(1, 0)

	if direction != Vector2.ZERO:
		screen.move_player(direction)
		time.tick()
		idle_ticks = 0  # Reset idle ticks when moving
		screen.check_unlock_conditions()  # Check unlock conditions during movement
	elif Input.is_action_just_pressed("ui_accept"):  # Space key for ticking forward
		time.tick()
		idle_ticks += 1  # Increment idle ticks when idling
		ghis_points += 1  # Accumulate Ghïs points when idling
		screen.update_tile_states()  # Call method to update tile states based on idle ticks
		screen.check_unlock_conditions()  # Check unlock conditions during idle

func _on_tick_updated(ticks, cycles, symbol):
	screen.ticks = ticks
	screen.cycles = cycles
	screen.idle_ticks = idle_ticks
	screen.ghis_points = ghis_points
	screen.render_viewport()

	if ticks % spawn_interval == 0 and screen.sprouts.size() < max_sprouts:
		screen.spawn_sprout()

	screen.update_sprouts()  # Update sprouts for decay
