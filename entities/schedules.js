var mongo = require('mongodb');
var getJson = require('../util/json');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true}),
    db = new Db('wpomonitordb', server),
    ps = require('../util/pagespeed');

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

    if (json.error) {
        console.trace(json.error);
        ps.error(json.error.errors[0].message+': '+json.error.errors[0].reason);
        return;
    }
    ps.error(false); // reset to false if no errors

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
        url = decodeURIComponent(req.body.url);

    console.log('Schedule for url: ', url);

    // get timestamp
    var timestamp = require('../util/timestamp'),
        currentTimestamp = timestamp.current();

    // get data from pagespeed
    var get = {
        host: 'www.googleapis.com',
        path: '/pagespeedonline/v1/runPagespeed?url=' + encodeURIComponent(url) +
            '&key=' + ps.key + '&strategy=' + ps.type + '&locale=' + ps.locale + '&prettyprint=false'
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

    // get data from yslow
    var YSlowLib = require('yslowjs/lib/yslow'),
        yslow = new YSlowLib(url,
                [ '--info', 'basic' ]);

    console.log('\nRunning (YSLOW Async)....');

    yslow.run( function (error, result) {
      if (error) {
        console.trace(error);
      } else {
        exports.writeStatsYslow(result, currentTimestamp, url);
      }
    });

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

}
