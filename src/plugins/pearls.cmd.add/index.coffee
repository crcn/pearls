outcome = require "outcome"
path    = require "path"
fs      = require "fs"
fglob   = require "fglob"
ini     = require "ini"

_exists = (path) ->
	try
		return !!fs.statSync path
	catch e
		return false

exports.plugin = () ->

	_packageName = (data) ->
		return JSON.parse(fs.readFileSync("#{data.directory}/package.json", "utf8")).name

	_name = (data) ->
		return data.name if data.name
		return _packageName data if _exists "#{data.directory}/package.json" 
		return path.basename data.directory

	_commandFromData = (data) ->
		commands = []


		cmdParts  = data.command.split(' ')
		command   = cmdParts.shift()
		arguments = cmdParts
		cwd	 	  = process.cwd()

		
		name: _name data
		command: command
		arguments: arguments
		directory: cwd
		group: data.group

	_loadIni = (file, data, callback) ->
		cfg = ini.parse(fs.readFileSync(file,'utf8'))

		commands = []
		for procName of cfg
			procCfg       = cfg[procName]
			procCfg.dir   = path.dirname file
			procCfg.name  = procName
			procCfg.group = data.group || path.basename(file).split('.').shift()
			commands.push _commandFromData procCfg
		
		callback(commands)
		


		

	_scanIni = (data, callback) ->

		
		fglob "#{data.directory}/*.prls", (files) ->

			return callback(null, []) if not files.length

			numRunning = files.length
			allCommands = [];

			for file in files
				do(file) ->
					_loadIni file, data, (commands) ->
						allCommands = allCommands.concat commands
						return callback(null, allCommands) if !(--numRunning)

		
	_loadCommands = (data, callback) ->

		data.directory = process.cwd() if not data.directory
		
		return callback(null, [_commandFromData data]) if data.command
		_scanIni data, callback


	option: 
		command: 'add :group :command OR add :command OR add'
		description: 'Adds a command or path to .pls'
		optional: 
			"--name": "Name of the process to add"
		callback: (data) =>

			_loadCommands data, outcome
				success: (commands) =>
					for command in commands

						@plugin('pearls.core').
						group(command.group).
						processes().
						add command.name, command, outcome error: (err) -> console.log(err.message)
			
				


		