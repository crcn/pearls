

exports.plugin = () ->


	option: 
		command: 'tail :group OR tail :group :process',
		description: 'Tails a group for logs',
		callback: () ->
			console.log("ADD")
		