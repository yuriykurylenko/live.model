var validators = {
    'required' : function(valueToSet) {
        return (!_.isNull(valueToSet) && !_.isUndefined(valueToSet) && !_.isEmpty(valueToSet));
    },

    'in' : function(whitelist, valueToSet) {
        return _.include(whitelist, valueToSet) ? undefined : "in";
    },

    'email' : function(valueToSet) {
        var emailRegex = new RegExp(
            "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
            'i'
        );

        if (_.isString(valueToSet) && !valueToSet.match(emailRegex)) {
            return false;
        }
        return true;
    },

    'url' : function(valueToSet) {
        // taken from jQuery UI validation
        var urlRegex = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        if (_.isString(valueToSet) && !valueToSet.match(urlRegex)) {
            return false;
        }
        return true;
    },

    'number' : function(valueToSet) {
        return isNaN(valueToSet) ? false : true;
    },

    'digits': function (valueToSet) {
        var isBeingSet = !_.isUndefined(valueToSet);
        return (!/^\d+$/.test(valueToSet) && isBeingSet) ? false : true;
    },

    'pattern' : function(pattern, valueToSet) {
        return (_.isString(valueToSet) && pattern.test(valueToSet));
    },

    'min' : function(minimumValue, valueToSet) {
        return (valueToSet >= minimumValue);
    },

    'max' : function(maximumValue, valueToSet) {
        return (valueToSet <= maximumValue);
    },

    'minlength' : function(minlength, valueToSet) {
        return (_.isString(valueToSet) && valueToSet.length >= minlength);
    },

    'maxlength' : function(maxlength, valueToSet) {
        return (_.isString(valueToSet) && valueToSet.length <= maxlength);
    }
}