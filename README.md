## Motivation

It's easier managing multiple processes in one terminal window vs having a dozen open.

## Features

- Run multiple process in parallel.
- Restart procs if any files change.
- Take running processes and start them under a pearl group.

## Requirements

- Node.js


## Installation

	npm install pearls

## Usage

In the project you want to run parallel processes, add a `app-name.prls` file with content similar to this:

```ini
[master]
command = node ./ --master

[slave]
command = node ./ --slave
```

In Terminal, navigate to your project directory, and call:

```
prls
```

Pearls will add the processes to the `app-name` group. You can start the process group by calling:

```
prls start app-name
```

## Help

```
Commands:
	start <prls file or group>     Start a new group of processes
	stop <group> <proc>            Stops a process in a group
	restart <group> <proc>         Restart a process in a group
	add <group> <cmd>              Adds a process to the given group
	remove <group> <proc>          Removes a process from a group
	save <group>                   Save a process group to /etc/pearls/groups
	status <group>                 Show group status
	watch <group> <proc> <yes|no>  Watches a processes cwd for any file changes
```


