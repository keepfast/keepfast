var BSON = require('mongodb').BSONPure;
var db = require('../util/db').open('pagespeeds');

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving pagespeed: ' + id);
    db.collection('pagespeeds', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByURL = function(req, res) {

    var url = req.params.url;
    console.log('Retrieving pagespeed: ' + url);

    db.collection('pagespeeds', function(err, collection) {
        collection.find({'url': url}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('pagespeeds', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addPagespeed = function(req, res) {

    var pagespeed = req.body;

    console.log('Adding pagespeed: ' + JSON.stringify(pagespeed));

    db.collection('pagespeeds', function(err, collection) {
        collection.insert(pagespeed, {safe:true}, function(err, result) {

            var msg = '';

            if (err) {
                msg = {'error':'An error has occurred'};
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                msg = result[0];
            }

            if(res) {
                res.send(msg);
            }
        });
    });
}

exports.updatePagespeed = function(req, res) {
    var id = req.params.id;
    var pagespeed = req.body;
    console.log('Updating pagespeed: ' + id);
    console.log(JSON.stringify(pagespeed));
    db.collection('pagespeeds', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, pagespeed, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating pagespeed: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(pagespeed);
            }
        });
    });
}

exports.deletePagespeed = function(req, res) {
    var id = req.params.id;
    console.log('Deleting pagespeed: ' + id);
    db.collection('pagespeeds', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

exports.deletePagespeedByURL = function(url) {

    console.log('Deleting pagespeed: ' + url);

    db.collection('pagespeeds', function(err, collection) {
        collection.remove({'url': url}, {safe:true}, function(err, result) {
            if (err) {
                return {'error':'An error has occurred - ' + err};
            } else {
                return '' + result + ' document(s) deleted';
            }
        });
    });
}
