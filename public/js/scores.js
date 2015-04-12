/*global $:false, getChart:false */

function Scores(){
}

Scores.prototype.runner = function(url) {
    this.getAllbyURL(encodeURIComponent(url));
};

Scores.prototype.getAllbyURL = function(url) {

    var data = { pagespeed: [], yslow: [] };

    var get_pagespeed = $.getJSON('/pagespeed/url/%url%/all.json'.replace('%url%', url), function(result) {
        if (result.length) {
            var items = { scores: [], timestamps: [] };

            $.each(result, function(key, val) {
                items.scores.push(val.score);
                items.timestamps.push(val.timestamp);
            });

            data.pagespeed = items;
        }
    });

    var get_yslow = $.getJSON('/yslow/url/%url%/all.json'.replace('%url%', url), function(result) {
        if (result.length) {
            var items = { scores: [], loadtime: [], timestamps: [] };

            $.each(result, function(key, val) {
                items.scores.push(val.score);
                items.timestamps.push(val.timestamp);
                items.loadtime.push(val.loadtime);
            });

           data.yslow = items;
        }
    });

    $.when(get_pagespeed, get_yslow)
     .then(function() {
        $('#connections-pagespeed').html(data.pagespeed.scores[data.pagespeed.scores.length - 1]);
        $('#connections-yslow').html(data.yslow.scores[data.yslow.scores.length - 1]);

        // convert ms to s
        var loadtime = (data.yslow.loadtime[data.yslow.loadtime.length - 1] / 1000);
        $('#connections-timetoload').html(loadtime.toFixed(1));

        getChart([{
          label: 'PageSpeed',
          color: '#3498DB',
          points: data.pagespeed.scores,
          timestamps: data.pagespeed.timestamps
        }, {
          label: 'YSlow',
          color: '#8E44AD',
          points: data.yslow.scores,
          timestamps: data.yslow.timestamps
        }], '#chart-history');
        // getChart(items.scores, items.timestamps, '#chart-pagespeed', '#34495E', 'PageSpeed');
        // getChart(items.scores, items.timestamps, '#chart-yslow', '#34495E', 'YSlow');
    });

};
