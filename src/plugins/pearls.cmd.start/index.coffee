

exports.plugin = () ->


	option: 
		command: 'start :group OR start :group :process'
		description: 'Start a new group of processes'
		callback: () ->
			console.log("ADD")
		