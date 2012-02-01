outcome = require "outcome"
require "colors"

exports.plugin = () ->
	
	_procColors = {}
	_colors = ['green','cyan','magenta','blue'];

	_nextColor = () ->
		color = _colors.shift()
		_colors.push color
		color


	_procColor = (name) -> _procColors[name] || (_procColors[name] = _nextColor())

	option: 
		command: 'start :group OR start :group :process'
		description: 'Start a new group of processes'
		callback: (data) =>

			group = @plugin('pearls.core').group(data.group)

			group.start outcome success: () ->
				
				group.on "stdout", (source) ->
					cliColor = _procColor source.process.name
					console.log("%s: %s", source.process.name[cliColor].bold, source.text);

				
				group.on "stderr", (source) ->
					cliColor = _procColor source.process.name
					console.error("%s: %s", source.process.name[cliColor].bold, source.text.red);

		