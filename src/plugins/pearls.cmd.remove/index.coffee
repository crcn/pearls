outcome = require "outcome"
path    = require "path"

exports.plugin = () ->



	option: 
		command: 'remove :group OR remove :group :processName'
		description: 'Removes a group or process'
		callback: (data) =>

			group = @plugin('pearls.core').group(data.group)

			if not data.processName
				group.remove(() -> ) 
			else 
				group.
				processes().
				remove data.processName, () ->
		