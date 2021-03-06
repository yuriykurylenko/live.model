var stateful = function(obj) {
    var dependencies = {},
        dependentObjects = [],
        stateComputers = {},
        stateChangeCallbacks = {},
        noticeInitial = {},
        state = {},
        computed = [];

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
                    this.object.on(eventName, _.bind(function() {
                        callback.call(this);
                    }, this));
                }, this);
            }

            return this;
        },

        inject: function(deps) {
            _.each(deps, function(dep, key) {
                dependencies[key] = dep;
                dep.addDependentObject(this);
            }, this);

            return this;
        },

        takeOut: function(deps) {
            // TBD
        },

        deps: function(dep) {
            return _.isString(dep) ? dependencies[dep] : dependencies;
        },

        addDependentObject: function(dep) {
            dependentObjects.push(dep);
        },

        // Private methods
        _getState: function(key) {
            return state[key];
        },

        _setState: function(key, value, isInitial) {
            state[key] = value;

            var omitCallback = isInitial && !noticeInitial[key];
            this.callStateComputers(isInitial, key);

            if (_.isFunction(stateChangeCallbacks[key]) && !omitCallback) {
                stateChangeCallbacks[key].call(this, value);
            }

            _.each(dependentObjects, function(dep) {
                dep.callStateComputers(isInitial);
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

                noticeInitial[stateName] = stateConfig.noticeInitial ? true : false;
            }, this);

            _.each(config, function(stateConfig, stateName) {
                if (
                    !_.isUndefined(stateConfig.initial) &&
                    this._getState(stateName) != stateConfig.initial
                ) {
                    this._setState(stateName, stateConfig.initial, true);
                } else {
                    this.callStateComputers(true);
                }
            }, this);

            return this;
        },

        callStateComputers: function(isInitial, omit) {
            _.each(stateComputers, function(computer, stateName) {
                if (stateName != omit && computed.indexOf(stateName) == -1) {
                    var computedState = computer.call(this);
                    if (this._getState(stateName) != computedState) {
                        this._setState(stateName, computer.call(this), isInitial);
                    }
                }
            }, this);

            return this;
        }
    }
}