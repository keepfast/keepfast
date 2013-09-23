var http = require("http");
var https = require("https");

exports.getJSON = function(options, onResult, res)
{
    console.log("rest::getJSON");

    // var prot = options.port == 443 ? https : http;
    var prot = https;
    var req = prot.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function(res) {
            var obj = eval("(" + output + ")");
            onResult(res.statusCode, obj, res);
        });
    });

    req.on('error', function(err) {
        res.send('error: ' + err.message);
    });

    req.end();
};