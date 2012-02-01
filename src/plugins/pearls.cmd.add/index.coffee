

exports.plugin = () ->


	option: 
		command: 'add :group :name ***'
		description: 'Adds a command or path to .pls'
		callback: () ->
			console.log("ADD")
		