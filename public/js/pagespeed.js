/*global $:false, getChart:false */

function Pagespeed(){
}

Pagespeed.prototype.runner = function(url) {
    this.getAllbyURL(encodeURIComponent(url));
};


Pagespeed.prototype.getAllbyURL = function(url) {

    var router = '/pagespeed/url/%url%/all.json'.replace('%url%', url);

    $.getJSON(router, function(data) {

        if(data.length){
            var items = {
                        scores: [],
                        timestamps: []
                        };

            $('#title-current-profile').html(data[0].url);

            $.each(data, function(key, val) {

                items.scores.push(val.score);

                items.timestamps.push(val.timestamp);
            });

            $('#connections-pagespeed').html(items.scores[items.scores.length - 1]);

            getChart('#34495E', items.scores, items.timestamps, '#chart-pagespeed', "Pagespeed");
        }
    });

};
