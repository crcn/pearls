EventEmitter = require("events").EventEmitter
outcome = require "outcome"

module.exports = class

	###
	###

	constructor: (@name, @config) ->

		@_em = new EventEmitter()


	###
	###

	running: () -> !!@_process

	###
	###

	start: (callback) ->
		
		return callback new Error "Process is already running" if @running()


		@_spawn outcome success: (proc)=>
			
			@_process = proc

			proc.on "stdout", (buffer) => @_em.emit "stdout", buffer
			proc.on "stderr", (buffer) => @_em.emit "stderr", buffer
			proc.on "exit", () => @_process = null
			
			callback()



	###
	###

	stop: (callback) ->

		return callback new Error "Process is not running" if not @running()

		@_em.once "exit", callback

		@_process.kill()


	###
	###

	restart: (callback) ->

		@start () => @stop => callback()


	###
	###

	on: (type, callback) -> 
		@_em.on type, callback

		dispose: () =>
			@_em.removeListener type, callback


	###
	###

	_spawn: () -> # override me