outcome = require "outcome"
path    = require "path"

exports.plugin = () ->


	loadCommands = (data) ->
		
		commands = []


		cmdParts  = data.command.split(' ')
		command   = cmdParts.shift()
		arguments = cmdParts
		cwd	 	  = process.cwd()

		console.log(data)
		commands.push
			name: data.name || path.basename cwd
			command: command
			arguments: arguments
			directory: cwd

		commands



	option: 
		command: 'add :group :command OR add :command OR add'
		description: 'Adds a command or path to .pls'
		optional: 
			"--name": "Name of the process to add"
		callback: (data) =>

			return if not data.command

			try
			
				for command in loadCommands data

					@plugin('pearls.core').
					group(data.group).
					processes().
					add command.name, command, outcome error: (err) -> console.log(err.message)
				
			catch e
				console.log e.stack
		