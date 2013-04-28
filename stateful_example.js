$(function() {
    var username = stateful($('#username')).state({
        empty: {
            compute: function() {
                return !this.state('text');
            }
        },
        available: {
            initial: false
        },
        valid: {
            change: function(value) {
                if (!value) {
                    this.object.addClass('error');
                } else {
                    this.object.removeClass('error');
                }
            },

            compute: function() {
                return !this.state('empty') && this.state('available');
            }
        },
        text: {
            initial: '',
            change: function(value) {
                this.object.val(value);
            }
        }
    }).behavior({
        keyup: function() {
            this.state('available', (Math.random() > 0.5));
            this.state('text', this.object.val());
        }
    });

    var availability = stateful($('#availability')).inject({
        'username': username
    }).state({
        ok: {
            change: function(value) {
                this.object.removeClass(value ? 'error' : 'success');
                this.object.addClass(value ? 'success' : 'error');
                this.object.html((value ? '' : 'Not ') + 'Available!');
            },

            compute: function() {
                return this.deps('username').state('available');
            }
        }
    });

    var password = stateful($('#password')).state({
        empty: {
            initial: true
        },
        strong: {},
        valid: {
            change: function(value) {
                this.object.removeClass(value ? 'error' : 'success');
                this.object.addClass(value ? 'success' : 'error');
            },
            compute: function() {
                return !this.state('empty');
            }
        }
    }).behavior({
        keyup: function() {
            var value = this.object.val();
            this.state('empty', _.isEmpty(value));
            this.state('strong', value.length >= 5);
        }
    });

    var strength = stateful($('#strength')).inject({
        password: password
    }).state({
        strong: {
            change: function(value) {
                this.object.removeClass(value ? 'error' : 'success');
                this.object.addClass(value ? 'success' : 'error');
                this.object.html(value ? 'Strong' : 'Weak');
            },

            compute: function() {
                return this.deps('password').state('strong');
            }
        }
    });

    var button = stateful($('#button')).inject({
        username: username,
        password: password
    }).state({
        enabled: {
            noticeInitial: true,

            change: function(value) {
                if (value) {
                    this.object.removeAttr('disabled');
                } else {
                    this.object.attr('disabled', 'disabled');
                }
            },

            compute: function() {
                return this.deps('username').state('valid') &&
                       this.deps('password').state('valid') &&
                       !this.state('requestPending');
            }
        },

        requestPending: {},
        requestComplete: {}
    }).behavior({
        click: function() {
            var that = this;
            this.state('requestPending', true);

            setTimeout(function() {
                that.state('requestPending', false);
                that.state('requestComplete', true);
            }, 3000);
        }
    });

    var loader = stateful($('#loader')).inject({
        button: button
    }).state({
        visible: {
            initial: false,
            noticeInitial: true,

            change: function(value) {
                if (value) {
                    this.object.show();
                } else {
                    this.object.hide();
                }
            },

            compute: function() {
                return this.deps('button').state('requestPending');
            }
        }
    });

    var message = stateful($('#message')).inject({
        button: button
    }).state({
        visible: {
            initial: false,
            noticeInitial: true,

            change: function(value) {
                if (value) {
                    this.object.show();
                } else {
                    this.object.hide();
                }
            },

            compute: function() {
                return this.deps('button').state('requestComplete');
            }
        }
    });
});