## Motivation

## Features

- Run multiple process in parallel.
- Restart procs of any cwd's change.

## Requirements

- Node.js


## Installation

	npm install pearls

## Usage

```bash

Commands:
	start <prls file>       Start a new group of processes
	manage <group> <pid>... Takes a running process, and restart it under group
	stop <group> <proc>     Stops a process in a group
	restart <group> <proc>  Restart a process in a group
	add <group> <cmd>       Adds a process to the given group

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
