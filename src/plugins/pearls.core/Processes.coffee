SpawnedProcess = require "./SpawnedProcess"
outcome = require "outcome"

module.exports = class 

	###
	###


	constructor: (@config, @group) ->
		@_procs = {};

	###
	###

	add: (name, ops, callback) ->

		return callback new Error "Process already exists" if @config.get name

		cfg = @config.set name, ops

		@get name, callback

	###
	###

	remove: (name, callback) ->

		self.get name, outcome 
			success: 
				self.stop name () =>
					
					callback() 

					@config.set name, undefined

					delete @_procs[name]
			error: callback
	
	###
	###

	get: (name, callback) ->

		return callback new Error "Process does not exist" if not @config.get name

		callback null, @_procs[name] || (@_procs[name] = new SpawnedProcess(name, @config.get(name), this));

	###
	###

	all: (callback) ->
		
		procs = Object.keys @config.get()
		numRunning = procs.length + 1
		all = []

		onProcess = () ->
			callback null, all if not --running

		for proc in procs
			self.get proc, (inst) ->
				all.push inst
				onProcess()

		## incase there aren't any processes
		onProcess()

	###
	###

	start: (name, callback) ->
		
		this.get name, outcome
			success: (proc) -> proc.start callback
			error: callback


	###
	###

	stop: (name, callback) ->
		
		this.get name, outcome
			success: (proc) -> proc.stop callback
			error: callback
