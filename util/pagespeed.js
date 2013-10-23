var config = require('../conf/pagespeed');
var error = false;

module.exports = {
    key: config.key,
    locale: config.locale,
    type: config.type,

    error: function(err) {
        if (config.key === 'YOUR_KEY_HERE') {
            return 'Invalid Key: Default configuration value set';
        }
        if (err) {
            error = err;
        }
        return error;
    }
};
