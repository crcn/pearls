EventEmitter = require("events").EventEmitter
spawn = require("child_process").spawn

module.exports = class extends require "./BaseProcess"

	###
	###

	_spawn: (callback) ->

		em = new EventEmitter()


		proc = spawn @config.get("command"), @config.get("arguments"), cwd: @config.get("directory")

		proc.stdout.on "data", (buffer) => em.emit "stdout", @_out buffer
		proc.stderr.on "data", (buffer) => em.emit "stderr", @_out buffer
		proc.on "exit", () -> em.emit "exit"

		callback null,
			on: () -> em.on.apply em, arguments
			kill: () -> proc.kill()



	_out: (buffer) ->

		return String(buffer).replace(/\n+/g,'');
		