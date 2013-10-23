var test = require('tape');
var path = require('path');
var root = path.join(__dirname, '..', '..');
// Overide configuration incase anything has
// been changed.
var conf = require(path.join(root, 'conf', 'pagespeed'));
    conf.key = 'YOUR_KEY_HERE';
    conf.locale = 'en';
    conf.type = 'desktop';

var ps = require(path.join(root, 'util', 'pagespeed'));

test('util/pagespeed', function(t) {
    t.plan(7);

    // default
    t.equal(ps.key, 'YOUR_KEY_HERE');
    t.equal(ps.locale, 'en');
    t.equal(ps.type, 'desktop');
    t.equal(ps.error(), 'Invalid Key: Default configuration value set');

    // non-default key
    conf.key = 'foobar';
    ps = require(path.join(root, 'util', 'pagespeed'));
    t.equal(ps.error(), false);

    // error setter
    ps.error('TEST_ERROR');
    t.equal(ps.error(), 'TEST_ERROR');

    // reset error
    ps.error(false);
    t.equal(ps.error(), false);
});

