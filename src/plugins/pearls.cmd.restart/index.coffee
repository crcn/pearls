

exports.plugin = () ->


	option: 
		command: 'restart :group OR restart :group :process'
		description: 'Restart group or process'
		callback: () ->
			console.log("ADD")
		