var db = require('../util/db').open('profiles');

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving profile: ' + id);
    db.collection('profiles', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('profiles', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addProfile = function(req, res) {
    var profile = req.body;
    console.log('Adding profile: ' + JSON.stringify(profile));
    db.collection('profiles', function(err, collection) {
        collection.insert(profile, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateProfile = function(req, res) {
    var id = req.params.id;
    var profile = req.body;
    console.log('Updating profile: ' + id);
    console.log(JSON.stringify(profile));
    db.collection('profiles', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, profile, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating profile: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(profile);
            }
        });
    });
}

exports.deleteProfile = function(req, res) {
    var id = req.params.id;
    console.log('Deleting profile: ' + id);
    db.collection('profiles', function(err, collection) {
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

exports.deleteProfileByURL = function(url) {

    db.collection('profiles', function(err, collection) {
        collection.remove({'url': url}, {safe:true}, function(err, result) {
            if (err) {
                return {'error':'An error has occurred - ' + err};
            } else {
                return '' + result + ' document(s) deleted';
            }
        });
    });
};
