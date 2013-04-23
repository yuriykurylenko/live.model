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