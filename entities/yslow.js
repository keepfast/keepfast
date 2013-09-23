var mongo = require('mongodb');
var getJson = require('../util/json');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('wpomonitordb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'wpomonitordb' database");
        db.collection('yslows', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'yslows' collection doesn't exist. Creating it with sample data...");
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving yslow: ' + id);
    db.collection('yslows', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByURL = function(req, res) {

    var url = req.params.url;
    console.log('Retrieving yslow: ' + url);

    db.collection('yslows', function(err, collection) {
        collection.find({'url': url}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('yslows', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addYslow = function(req, res) {

    var yslow = req.body;

    console.log('Adding yslow: ' + JSON.stringify(yslow));

    db.collection('yslows', function(err, collection) {
        collection.insert(yslow, {safe:true}, function(err, result) {

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

exports.updateYslow = function(req, res) {
    var id = req.params.id;
    var yslow = req.body;
    console.log('Updating yslow: ' + id);
    console.log(JSON.stringify(yslow));
    db.collection('yslows', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, yslow, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating yslow: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(yslow);
            }
        });
    });
}

exports.deleteYslowByURL = function(url) {

    console.log('Deleting yslow: ' + url);

    db.collection('yslows', function(err, collection) {
        collection.remove({'url': url}, {safe:true}, function(err, result) {
            if (err) {
                return {'error':'An error has occurred - ' + err};
            } else {
                return '' + result + ' document(s) deleted';
            }
        });
    });
}

exports.deleteYslow = function(req, res) {
    var id = req.params.id;
    console.log('Deleting yslow: ' + id);
    db.collection('yslows', function(err, collection) {
        collection.remove({'_id': new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}