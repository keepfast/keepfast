/*global $:false, getChart:false */

function Yslow(){
}

Yslow.prototype.runner = function(url) {
    this.getAllbyURL(encodeURIComponent(url));
};

Yslow.prototype.getAllbyURL = function(url) {

    var router = '/yslow/url/%url%/all.json'.replace('%url%', url);

    $.getJSON(router, function(data) {

        if(data.length){
            var items = {
                        scores: [],
                        loadtime: [],
                        timestamps: []
                        };

            $.each(data, function(key, val) {

                items.scores.push(val.score);

                items.timestamps.push(val.timestamp);
                items.loadtime.push(val.loadtime);
            });

            $('#connections-yslow').html(items.scores[items.scores.length - 1]);

            // convert ms to s
            var loadtime = (items.loadtime[items.loadtime.length - 1]/1000);
            $('#connections-timetoload').html(loadtime.toFixed(1));

            getChart('#34495E', items.scores, items.timestamps, '#chart-yslow', "Yslow");
        }
    });

};
