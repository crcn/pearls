SpawnedProcess = require "./SpawnedProcess"
outcome = require "outcome"
BaseProcess = require "./BaseProcess"
outcome = require "outcome"
spawnCollection = require "./spawnCollection"

module.exports = class 

	###
	###


	constructor: (@config, @group) ->
		@_procs = {};

	###
	###

	add: (name, ops, callback) ->

		return callback new Error "Process \"#{name}\" already exists" if @config.get name

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

		return callback new Error "Process \"#{name}\" does not exist" if not @config.get name

		callback null, @_procs[name] || (@_procs[name] = new SpawnedProcess(name, @config.child(name), this));

	###
	###

	all: (callback) ->
		
		procs = Object.keys @config.get() || {}
		numRunning = procs.length + 1
		all = []

		onProcess = () ->
			callback null, all if not --numRunning

		for proc in procs
			@get proc, outcome success: (inst) ->
				all.push inst
				onProcess()

		## incase there aren't any processes
		onProcess()


	###
	###

	_spawn: (callback) ->
		
		@all outcome success: (processes) =>
			
			spawnCollection processes, callback



