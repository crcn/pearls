cli = require "celeri"
TreeProcess = require "./TreeProcess"
yaconfig = require "yaconfig"

exports.plugin = (router, params) ->
	
	root = new TreeProcess "root", yaconfig.file "#{params.dir}/processes.json"

		
	init: () =>
		
		cli.option plugin.option for plugin in @plugins("pearls.cmd.*")
		

		## process the CLI arguments
		cli.parse process.argv


	group: (name) => if name then root.child name else root