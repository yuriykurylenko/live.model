/*
    $('#username').state({
        empty: {},
        available: {},
        valid: {
            change: function(value) {
                if (!value) {
                    this.$el.addClass('error');
                } else {
                    this.$el.removeClass('error');
                }
            }
        }
    }).behavior({
        textchange: function() {
            checkAvailability(function(available) {
                this.state('available', available);
            });
            this.state('empty', _.isEmpty(this.val()));
        }
    });

    $('#form').state({
        valid: {
            compute: function(username) {
                return username.state('valid');
            }
        }
    }).dependsOn('#username');

    $('#button').state({
        enabled: {
            change: function(value) {
                if (value) {
                    this.$el.removeAttr('disabled');
                } else {
                    this.$el.attr('disabled', 'disabled');
                }
            },

            compute: function(form) {
                return !form.state('valid')
            }
        }
    }).dependsOn('#form');
*/

var stateful = function(obj) {
    var dependencies = {},
        dependentObjects = {},
        stateComputers = {},
        stateChangeCallbacks = {},
        state = {};

    return {
        object: obj,

        state: function() {
            var key = arguments[0],
                value = arguments[1];

            if (_.isObject(key)) {
                return this._configureState(key);
            } else if (_.isString(key)) {
                return !_.isUndefined(value) ? this._setState(key, value) : this._getState(key);
            }
        },

        behavior: function(config) {
            if (_.isObject(config)) {
                _.each(config, function(callback, eventName) {
                    this.object.on(eventName, _.bind(callback, this));
                }, this);
            }
        },

        inject: function(deps) {
            _.each(deps, function(dep, key) {
                dependencies[key] = dep;
                dep.addDependentObject(this);
            }, this);
        },

        takeOut: function(deps) {
            // TBD
        },

        deps: function(dep) {
            return _.isString(dep) ? dependencies[dep] : dependencies;
        },

        addDependentObject: function(dep) {
            dependentObjects.push(this);
        },

        // Private methods
        _getState: function(key) {
            return state[key];
        },

        _setState: function(key, value) {
            state[key] = value;

            _.each(stateComputers, function(computer, stateName) {
                if (stateName != key) {
                    this._setState(stateName, computer.call(this));
                }
            }, this);

            if (_.isFunction(stateChangeCallbacks[key])) {
                stateChangeCallbacks[key].call(this, value);
            }

            _.each(dependentObjects, function(dep) {
                dep.callStateComputers();
            });

            return this;
        },

        _configureState: function(config) {
            _.each(config, function(stateConfig, stateName) {
                if (_.isFunction(stateConfig.compute)) {
                    stateComputers[stateName] = stateConfig.compute;
                }

                if (_.isFunction(stateConfig.change)) {
                    stateChangeCallbacks[stateName] = stateConfig.change;
                }
            });

            if (_.isObject(config.initial)) {
                _.each(config.initial, function(value, key) {
                    this._setState(key, value);
                }, this);
            }

            return this;
        },

        callStateComputers: function() {
            _.each(stateComputers, function(computer, stateName) {
                this._setState(stateName, computer.call(this));
            }, this);

            return this;
        }
    }
}