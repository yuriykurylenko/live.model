var value = function(data) {
    var proxy;
    var url;

    return {
        get: function() {
            return data;
        },

        set: function(val) {
            if (_.isUndefined(val)) {
                throw new Error('Error in value.set(): first argument shouldn\'t be undefined!')
            }

            data = val;
            return this;
        },

        proxy: function(config) {
            url = config.url;
            return this;
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