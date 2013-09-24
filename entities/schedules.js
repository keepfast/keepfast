var mongo = require('mongodb');
var getJson = require('../util/json');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true}),
    db = new Db('wpomonitordb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'wpomonitordb' database");
        db.collection('schedules', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'schedule' collection doesn't exist. Creating it with sample data...");
            }
        });
    }
});

exports.writeStatsPagespeed = function(json, currentTimestamp, url) {

    // load interfaces with models
    var profile = require('./profiles'),
        pagespeed = require('./pagespeeds'),
        pagestats = require('./pagestats');

    // create pagestat item
    var pagestatItem = {};
        pagestatItem.body = {url: json.id,
                             timestamp: currentTimestamp,
                             numberResources: json.pageStats.numberResources,
                             numberHosts: json.pageStats.numberHosts,
                             totalRequestBytes: json.pageStats.totalRequestBytes,
                             numberStaticResources: json.pageStats.numberStaticResources,
                             htmlResponseBytes: json.pageStats.htmlResponseBytes,
                             cssResponseBytes: json.pageStats.cssResponseBytes,
                             imageResponseBytes: json.pageStats.imageResponseBytes,
                             javascriptResponseByte: json.pageStats.javascriptResponseBytes,
                             otherResponseBytes: json.pageStats.otherResponseBytes,
                             numberJsResources: json.pageStats.numberJsResources,
                             numberCssResources: json.pageStats.numberCssResources};

    // create pagespeed item
    var pagespeedItem = {};
        pagespeedItem.body = {url: url,
                              timestamp: currentTimestamp,
                              strategy: json.request.strategy,
                              score: json.score};

    // insert items
    pagestats.addPagestats(pagestatItem);
    pagespeed.addPagespeed(pagespeedItem);
};


exports.writeStatsYslow = function(json, currentTimestamp, url) {

    // load interfaces with models
    var yslow = require('./yslow');

    // create yslow item
    var yslowItem = {};
        yslowItem.body = {url: url,
                          timestamp: currentTimestamp,
                          strategy: 'desktop',
                          loadtime: json.lt,
                          score: json.o};

    console.log(yslowItem.body);


    // insert items
    yslow.addYslow(yslowItem);
};

exports.addSchedule = function(req, res) {

    var https = require('https'),
        key = require('../conf/pagespeed').key,
        url = decodeURIComponent(req.body.url),
        locale = 'en',
        type = 'desktop';

    console.log('Schedule for url: ', url);

    // get timestamp
    var timestamp = require('../util/timestamp'),
        currentTimestamp = timestamp.current();

    // get data from pagespeed
    if (key !== 'YOUR_KEY_HERE') {
        var get = {
            host: 'www.googleapis.com',
            path: '/pagespeedonline/v1/runPagespeed?url=' + encodeURIComponent(url) +
                '&key=' + key + '&strategy=' + type + '&locale=' + locale + '&prettyprint=false'
        };

        var output = '';

        https.get(get, function(res){

            res.on('data', function(chunk){
                output += chunk;
            });

            res.on('end', function() {
                var obj = JSON.parse(output);
                exports.writeStatsPagespeed(obj, currentTimestamp, url);
            });

        });
    } else {
        console.log('Pagespeed skipped, update ./conf/pagespeed.js with your pagespeed key.');
    }

    // get data from yslow
    var YSlowLib = require('yslowjs/lib/yslow'),
        yslow = new YSlowLib(url,
                [ '--info', 'basic' ]);

    console.log('\nRunning (YSLOW Async)....');

    try {
      yslow.run( function (result) {
        exports.writeStatsYslow(result, currentTimestamp, url);
      });
    }
    catch (e) {
        console.trace(e);
    }

    res.send({'status': "200",
              'msg': "wait a few moments"});

};

exports.removeSchedulesByURL = function(req, res) {

    var https = require('https'),
        url = req.params.url;

    console.log('Removing for url: ', url);

        // load interfaces with models
    var yslow = require('./yslow');
    var pagespeed = require('./pagespeeds');
    var pagestat = require('./pagestats');
    var profile = require('./profiles');

    // create yslow item
    console.log(yslow.deleteYslowByURL(url));
    console.log(pagestat.deletePagestatsByURL(url));
    console.log(pagespeed.deletePagespeedByURL(url));
    console.log(profile.deleteProfileByURL(url));

    res.send({'status': "200",
              'msg': "removing"});

};
