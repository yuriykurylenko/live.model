var lazyObject = function() {
    var deferreds = {};

    // Result returning
    return {
        with: function(props, callback, scope) {
            if (!_.isString(props) && !_.isArray(props)) {
                throw new Error('Error in lazyObject.with(): first argument should be a string or an array!');
            }
            if (!_.isFunction(callback)) {
                throw new Error('Error in lazyObject.with(): second argument should be a function!');
            }

            props = _.isString(props) ? [ props ] : props

            var deferredValues = _.map(props, function(propName) {
                if (!deferreds[propName]) {
                    deferreds[propName] = deferred();
                }

                return deferreds[propName];
            });

            when.apply(null, deferredValues).done(function() {
                callback.apply(scope, arguments);
            });
        },

        set: function(prop, value) {
            if (!_.isString(prop) && !_.isObject(prop)) {
                throw new Error('Error in lazyObject.set(): first argument should be a string or an object!');
            }

            if (_.isObject(prop)) {
                _.each(prop, function(value, key) {
                    this.set(key, value);
                }, this);
            } else {
                if (!deferreds[prop]) {
                    deferreds[prop] = deferred();
                }
                deferreds[prop].resolve(value);
            }
        }
    };
}