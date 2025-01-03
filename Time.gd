# scripts/Time.gd
extends Node

@export var ticks_per_cycle: int = 100
@export var cycle_symbols: Array[String] = ["⨀", "⨁", "⨂", "⨃", "⨄", "⨅", "⨆", "⨇", "⨈", "⨉"]

var ticks: int = 0
var cycles: int = 0

signal tick_updated(ticks, cycles, symbol)

func tick():
	ticks += 1

	if ticks >= ticks_per_cycle:
		ticks = 0
		cycles += 1
		if cycles >= cycle_symbols.size():
			cycles = 0

	emit_signal("tick_updated", ticks, cycles, cycle_symbols[cycles])
	print("Tick: %d, Cycle: %s" % [ticks, cycle_symbols[cycles]])

