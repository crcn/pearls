Processes = require "./Processes"
EventEmitter = require("events").EventEmitter
outcome = require "outcome"
disposable = require "disposable"

module.exports = class GroupProcess  extends require "./BaseProcess"
	
	###
	###

	constructor: (name, config, @parent) ->
		super name, config
		@_children = {}
		
	###
	###

	child: (name) -> @_children[name] || (@_children[name] = new GroupProcess name, @config.get("groups:" + name), @)

	###
	###

	processes: () -> @_procs || (@_procs = new Processes @config.get("processes"), @)
		

	###
	###

	_spawn: (callback) ->
		
		em = new EventEmitter()
		listeners = disposable()

		@processes().all outcome success: (processes) =>
			
			numStopping = process.length + 1
			numStarting = processes.length + 1

			# controls the processes
			control = 
				on: () -> em.apply null, arguments
				kill: () ->
					
					onStop = () ->
						em.emit "exit" if not (--numStopping)

					process.stop onStop for process in processes

					onStop()

			

			onStart = () =>
				callback null, control if not (--numStopping)

			onOut = (process, type) ->
				listener.add process.on type, (buffer) ->
					em.emit type,
						process: process
						text: buffer

			for process in processes
				do (process) ->
					process.start onStart
					onOut process, "stdout"
					onOut process, "stderr"



			onStart()


		

