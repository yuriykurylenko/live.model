var deferred = function() {
    var value,
        callbacks = [],

        applyCallbacks = function() {
            _.each(callbacks, function(callback) {
                callback.fn.call(
                    callback.scope || window,
                    value
                );
            });
            callbacks = [];
        };

    return {
        done: function(callback, scope) {
            if (!_.isFunction(callback)) {
                throw new Error('Error in deferred.done(): first argument should be a function!');
            }

            if (value) {
                callback.call(scope, value);
            } else {
                callbacks.push({
                    fn: callback,
                    scope: scope
                });
            }
        },

        resolve: function(val) {
            value = val;
            applyCallbacks();
        },

        // For internal use inside when() only!
        getCurrentValue: function() {
            return value;
        }
    }
};

var when = function() {
    var firstDeferred = _.first(arguments),
        restOfDeferreds = _.rest(arguments, 1);

    if (
        !_.isFunction(firstDeferred.done) ||
        !_.isFunction(firstDeferred.resolve) ||
        !_.isFunction(firstDeferred.getCurrentValue)
    ) {
        throw new Error('Error in when(): all the arguments should be deferreds!');
    }

    return {
        done: function(callback, scope) {
            if (!_.isFunction(callback)) {
                throw new Error('Error in when.done(): first argument should be a function!');
            }

            firstDeferred.done(function(value) {
                if (!restOfDeferreds.length) {
                    callback.call(scope, value);
                } else {
                    when.apply(null, restOfDeferreds).done(function() {
                        callback.apply(
                            scope,
                            [].concat(
                                [ firstDeferred.getCurrentValue() ],

                                // transforming "arguments" variable to a real array
                                // ("arguments" is not an array, and concat() doesn't work with it properly)
                                _.map(arguments, function(arg) {
                                    return arg;
                                })
                            )
                        );
                    }, scope);
                }
            });
        }
    }
}



/*var d1 = deferred();
var d2 = deferred();
var d3 = deferred();

d1.resolve('failure');

when(d1, d2, d3).done(function(v1, v2, v3) {
    console.log(v1, v2, v3);
});

d1.resolve('success2');
d2.resolve('success3');

setTimeout(function() {
    d2.resolve('failure');
    d3.resolve('success4');
}, 3000);*/