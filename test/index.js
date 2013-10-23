var glob = require('glob');
var join = require('path').join;

// run anything in ./test
glob(join(__dirname, '..', 'test', '*_test.js'), function (err, files) {
    files.forEach(function (file) {
        require(file);
    });
});

// run anything in ./test/**
glob(join(__dirname, '..', 'test', '**', '*_test.js'), function (err, files) {
    files.forEach(function (file) {
        require(file);
    });
});

