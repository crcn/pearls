

exports.plugin = () ->


	option: 
		command: 'stop :group OR stop :group :process',
		description: 'Stop a process group or process',
		callback: () ->
			console.log("ADD")
		