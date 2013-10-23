var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('wpomonitordb', server, { safe: true });

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'wpomonitordb' database");
        db.collection('pagestats', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'pagestats' collection doesn't exist. Creating it with sample data...");
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving pagestats: ' + id);
    db.collection('pagestats', function(err, collection) {
        collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByDate = function(req, res) {

    var date = req.params.date;
    console.log('Retrieving pagestats: ' + date);

    db.collection('pagestats', function(err, collection) {
        collection.findOne({'date': date}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByURL = function(req, res) {

    var url = req.params.url;
    console.log('Retrieving pagestats: ' + url);

    db.collection('pagestats', function(err, collection) {
        collection.find({'url': url}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('pagestats', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addPagestats = function(req, res) {

    var pagestats = req.body;

    console.log('Adding pagestats: ' + JSON.stringify(pagestats));

    db.collection('pagestats', function(err, collection) {
        collection.insert(pagestats, {safe:true}, function(err, result) {

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

exports.updatePagestats = function(req, res) {
    var id = req.params.id;
    var pagestats = req.body;
    console.log('Updating pagestats: ' + id);
    console.log(JSON.stringify(pagestats));
    db.collection('pagestats', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, pagestats, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating pagestats: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(pagestats);
            }
        });
    });
}

exports.deletePagestats = function(req, res) {
    var id = req.params.id;
    console.log('Deleting pagestats: ' + id);
    db.collection('pagestats', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

exports.deletePagestatsByURL = function(url) {

    console.log('Deleting pagestats: ' + url);

    db.collection('pagestats', function(err, collection) {
        collection.remove({'url': url}, {safe:true}, function(err, result) {
            if (err) {
                return {'error':'An error has occurred - ' + err};
            } else {
                return '' + result + ' document(s) deleted';
            }
        });
    });
};
