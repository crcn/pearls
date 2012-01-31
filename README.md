## Motivation

It's easier managing multiple processes in one terminal window vs having a dozen open.

## Features

- Run multiple process in parallel.
- Restart procs of any cwd's change.
- Take running processes and start them under a pearl group.

## Requirements

- Node.js


## Installation

	npm install pearls

## Usage

```

Commands:
	start <prls file>              Start a new group of processes
	manage <group> <pid>...        Takes a running process, and restart it under group
	stop <group> <proc>            Stops a process in a group
	restart <group> <proc>         Restart a process in a group
	add <group> <cmd>              Adds a process to the given group
	remove <group> <proc>          Removes a process from a group
	save <group> <prls file>       Save a process group to a prls file
	status <group>                 Show group status
	watch <group> <proc> <yes|no>  Watches a processes cwd for any file changes

```


## Config

In your cwd, write a `.prls` file

```ini
[process-name]
command = node ./some/process
watch = true

[another-process]
command = node ./another/proc
watch = false
```
