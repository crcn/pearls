(function() {
  var BaseProcess, EventEmitter, Processes, TreeProcess, disposable, outcome, spawnCollection,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Processes = require("./Processes");

  EventEmitter = require("events").EventEmitter;

  outcome = require("outcome");

  disposable = require("disposable");

  BaseProcess = require("./BaseProcess");

  spawnCollection = require("./spawnCollection");

  module.exports = TreeProcess = (function(_super) {

    __extends(TreeProcess, _super);

    /*
    */

    function TreeProcess(name, config, parent) {
      this.parent = parent;
      TreeProcess.__super__.constructor.call(this, name, config);
      this._children = {};
    }

    /*
    */

    TreeProcess.prototype.child = function(name) {
      return this._children[name] || (this._children[name] = new TreeProcess(name, this.config.child("groups:" + name), this));
    };

    /*
    */

    TreeProcess.prototype.remove = function(name, callback) {
      var child;
      if (typeof name === "function") {
        callback = name;
        name = void 0;
      }
      if (!name) return this.parent.remove(this.name, callback);
      child = this._children[name];
      if (child) child.stop(function() {});
      delete this._children[name];
      this.config.set("groups:" + name, void 0);
      return callback();
    };

    /*
    */

    TreeProcess.prototype.processes = function() {
      return this._procs || (this._procs = new Processes(this.config.child("processes"), this));
    };

    /*
    */

    TreeProcess.prototype.all = function(callback) {
      var allProcesses, children, numChildren, onProcesses;
      children = Object.keys(this.config.get('groups') || {});
      allProcesses = [];
      numChildren = children.length + 1;
      onProcesses = function(processes) {
        allProcesses = processes.concat(allProcesses);
        if (!(--numChildren)) return callback(null, allProcesses);
      };
      return this.processes().all(outcome({
        success: function(processes) {
          var name, _i, _len, _results;
          onProcesses(processes);
          _results = [];
          for (_i = 0, _len = children.length; _i < _len; _i++) {
            name = children[_i];
            _results.push(this.child(name).all(outcome({
              success: onProcesses
            })));
          }
          return _results;
        }
      }));
    };

    /*
    */

    TreeProcess.prototype._spawn = function(callback) {
      var _this = this;
      return this.all(outcome({
        success: function(processes) {
          return spawnCollection(processes, callback);
        }
      }));
    };

    return TreeProcess;

  })(BaseProcess);

}).call(this);
