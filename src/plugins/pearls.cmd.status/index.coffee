

exports.plugin = () ->


	option: 
		command: 'status OR status :group',
		description: 'Gives the status of each running process',
		callback: () ->
			console.log("ADD")
		