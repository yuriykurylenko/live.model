var lazyObject = function() {
    var deferreds = {};

    // Result returning
    return {
        with: function(props, callback, scope) {
            if (_.isString(props)) {
                props = [ props ];
            } else if (!_.isArray(props)) {
                throw new Error(
                    'Error in lazyObject.with(): "property/properties list" value should be a string or an array!'
                );
            }

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
            if (!deferreds[prop]) {
                deferreds[prop] = deferred();
            }
            deferreds[prop].resolve(value);
        }
    };
}