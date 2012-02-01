outcome = require "outcome"

exports.plugin = () ->


	option: 
		command: 'status OR status :group',
		description: 'Gives the status of each running process',
		callback: (data) =>

			try

				@plugin('pearls.core').group(data.group).all outcome success: (processes) ->
					
					for process in processes
						do(process) ->
							
			catch e
				console.log e.stack