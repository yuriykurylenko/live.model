var lazyObject = function() {
    var deferreds = {};

    // Result returning
    return {
        with: function(keys, callback, scope) {
            if (!_.isString(keys) && !_.isArray(keys)) {
                throw new Error('Error in lazyObject.with(): first argument should be a string or an array!');
            }
            if (!_.isFunction(callback)) {
                throw new Error('Error in lazyObject.with(): second argument should be a function!');
            }

            keys = _.isString(keys) ? [ keys ] : keys

            var deferredValues = _.map(keys, function(key) {
                if (!deferreds[key]) {
                    deferreds[key] = deferred();
                }

                return deferreds[key];
            });

            when.apply(null, deferredValues).done(function() {
                callback.apply(scope, arguments);
            });
        },

        set: function(key, value) {
            if (!_.isString(key) && !_.isObject(key)) {
                throw new Error('Error in lazyObject.set(): first argument should be a string or an object!');
            }

            if (_.isObject(key)) {
                _.each(key, function(value, k) {
                    this.set(k, value);
                }, this);
            } else {
                if (!deferreds[key]) {
                    deferreds[key] = deferred();
                }
                deferreds[key].resolve(value);
            }
        }
    };
}