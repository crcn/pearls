## Motivation

I built this utility because it's easier managing multiple processes in one terminal window vs having a dozen open.

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
Usage: [command] --arg=value --arg2

Help:
  help        Show help menu                              
  [cmd] help  Show command help menu                      

Options:
  add         Adds a command or path to .pls              
  remove      Removes a group or process                    
  start       Start a new group of processes                      
  
```


