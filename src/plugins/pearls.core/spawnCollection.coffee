EventEmitter = require("events").EventEmitter
disposable   = require("disposable")
outcome      = require "outcome"

module.exports = (processes, callback) ->

	em = new EventEmitter()
	listeners = disposable.create()

	numStopping = processes.length + 1
	numStarting = processes.length + 1

	# controls the processes
	control = 
		on: () -> em.on.apply em, arguments

		# kills all the processes
		kill: () ->
			
			onStop = () ->
				em.emit "exit" if not (--numStopping)

			process.stop onStop for process in processes
				
			listeners.dispose()

			onStop()

	
	# called when a process is started
	onProcessStart = () =>
		callback null, control if not (--numStopping)

	# listens for stdout for any data, and returns the origin of the stdout data
	onOut = (process, type) ->
		listeners.add process.on type, (buffer) ->
			em.emit type,
				process: process
				text: buffer

	# start all the processes
	for process in processes
		do (process) ->
			process.start onProcessStart
			onOut process, "stdout"
			onOut process, "stderr"



	onProcessStart()