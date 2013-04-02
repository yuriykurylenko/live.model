var value = function(data) {
    var proxy;
    var url;
    var validationFunctions = {};
    var validationErrors = [];

    return {
        get: function() {
            return data;
        },

        set: function(val) {
            if (_.isUndefined(val)) {
                throw new Error('Error in value.set(): first argument shouldn\'t be undefined!')
            }

            if (this.validate(val)) {
                data = val;
            } else {
                alert(validationErrors);
            }
            return this;
        },

        proxy: function(config) {
            url = config.url;
            return this;
        },

        validations: function(list) {
            _.each(list, function(name) {
                validationFunctions[name] = validators[name];
            });
            return this;
        },

        validate: function(val) {
            validationErrors = [];
            _.each(validationFunctions, function(validator, name) {
                if (!validator(val)) {
                    validationErrors.push(name);
                }
            });
            return !validationErrors.length ? true : false;
        },

        fetch: function(callback, scope) {
            if (!url) {
                throw new Error('Error in value.fetch(): url should be specified!');
            }

            var that = this;
            scope = !_.isUndefined(scope) ? scope : this;

            $.get(url).success(function(val) {
                that.set(val);
                if (_.isFunction(callback)) {
                    callback.call(scope, val);
                }
            }).error(function(response) {
                throw new Error(
                    'Error in value.fetch(): ' + response.status + ' ' + response.statusText + ' for ' + url
                );
            });

            return this;
        }
    }
}