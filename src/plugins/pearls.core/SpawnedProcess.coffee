EventEmitter = require("events").EventEmitter
spawn = require("child_process").spawn
BaseProcess = require "./BaseProcess"

module.exports = class extends BaseProcess

	###
	###

	_spawn: (callback) ->

		em = new EventEmitter()


		proc = spawn @config.get("command"), @config.get("arguments"), cwd: @config.get("directory")

		out = (type, buffer) ->
			buffer = String(buffer)
			for chunk in buffer.split /\n+/g
				continue if !chunk.match(/[^\s]+/)
				em.emit type, chunk

		proc.stdout.on "data", (buffer) -> out "stdout", buffer
		proc.stderr.on "data", (buffer) -> out "stderr", buffer
		proc.on "exit", () -> em.emit "exit"

		callback null,
			on: () -> em.on.apply em, arguments
			kill: () -> proc.kill()


		