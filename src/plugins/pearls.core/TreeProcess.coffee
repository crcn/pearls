Processes = require "./Processes"
EventEmitter = require("events").EventEmitter
outcome = require "outcome"
disposable = require "disposable"
BaseProcess = require "./BaseProcess"
spawnCollection = require "./spawnCollection"

module.exports = class TreeProcess  extends BaseProcess
	
	###
	###

	constructor: (name, config, @parent) ->
		super name, config
		@_children = {}
		
	###
	###

	child: (name) -> @_children[name] || (@_children[name] = new TreeProcess name, @config.child("groups:#{name}"), @)


	###
	###

	remove: (name, callback) ->

		if typeof name == "function"
			callback = name
			name = undefined

		return @parent.remove @name, callback if not name

		child = @_children[name]

		child.stop(() -> ) if child

		delete @_children[name]
		@config.set("groups:#{name}", undefined);

		callback()
	###
	###

	processes: () ->  @_procs || (@_procs = new Processes @config.child("processes"), @)
		

	###
	###

	all: (callback) -> 

		children = Object.keys(@config.get('groups') || {})

		allProcesses = []
		numChildren = children.length + 1

		onProcesses = (processes) ->
			allProcesses = processes.concat allProcesses
			callback null, allProcesses if not (--numChildren)

		@processes().all outcome success: (processes) ->
			
			onProcesses processes

			@child(name).all outcome success: onProcesses for name in children


	###
	###

	_spawn: (callback) ->
		
		@all outcome success: (processes) =>
			
			spawnCollection processes, callback
			
			

