cli = require "celeri"
GroupProcess = require "./GroupProcess"
yaconfig = require "yaconfig"

exports.plugin = (router, params) ->
	
	root = new GroupProcess "root", yaconfig.file "#{params.dir}/processes.json"
	
		
	init: () =>
		
		cli.option plugin.option for plugin in @plugins("pearls.cmd.*")
		
		cli.parse process.argv

	group: () =>