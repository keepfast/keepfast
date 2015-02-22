var test = require('tape');
var path = require('path');
var root = path.join(__dirname, '..', '..');
var confDB = require('../conf/db');

// stub db open - so mongo doesn't have to
// be present for unit tests to pass
var Db = require('mongodb').Db;
Db.prototype.open = function () {
    return true;
};

var db = require(path.join(root, 'util', 'db'));

test('util/db', function(t) {
    t.plan(3);

    var dbc;
    t.ok(dbc = db.open('testcollection'));

    t.equal(dbc.databaseName, confDB.name);
    t.equal(dbc.options.safe, true);
});
