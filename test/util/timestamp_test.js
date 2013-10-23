var test = require('tape');
var path = require('path');
var root = path.join(__dirname, '..', '..');
var timestamp = require(path.join(root, 'util', 'timestamp'));

test('util/timestamp', function(t) {
    t.plan(1);
    // return value is valid date
    t.ok(new Date(timestamp.current()));
});

