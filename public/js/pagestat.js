/*global $:false, getChart:false */

function Pagestat(){
}

Pagestat.prototype.runner = function(url) {
    this.getAllbyURL(encodeURIComponent(url));
};


Pagestat.prototype.getTotalBytesTransferred = function() {

    var last = arguments[0].length - 1,
        pageSize = 0;

        for (var i = 0; i < arguments.length; i++) {
            pageSize += parseInt((arguments[i][last] ? arguments[i][last] : 0), 10);
        }

        // convert bytes to Mb
        pageSize = pageSize / (1024*1024);

    return pageSize;
};

Pagestat.prototype.getAllbyURL = function(url) {

    var router = '/pagestats/url/%url%/all.json'.replace('%url%', url),
        that = this;

    $.getJSON(router, function(data) {

        var items = {
                    scores: [],
                    dates: [],
                    timestamps: [],
                    numberHosts: [],
                    totalRequestBytes: [],
                    numberStaticResources: [],
                    htmlResponseBytes: [],
                    cssResponseBytes: [],
                    imageResponseBytes: [],
                    javascriptResponseBytes: [],
                    otherResponseBytes: [],
                    numberJsResources: [],
                    numberCssResources: [],
                    numberResources: []
                    };

        $('#title-current-profile').html(decodeURIComponent(url));

        $.each(data, function(key, val) {
            items.numberResources.push(val.numberResources);
            items.numberHosts.push(val.numberHosts);
            items.totalRequestBytes.push(val.totalRequestBytes);
            items.cssResponseBytes.push(val.cssResponseBytes);
            items.htmlResponseBytes.push(val.htmlResponseBytes);
            items.imageResponseBytes.push(val.imageResponseBytes);
            items.numberStaticResources.push(val.numberStaticResources);
            items.javascriptResponseBytes.push(val.javascriptResponseBytes);
            items.otherResponseBytes.push(val.otherResponseBytes);
            items.numberJsResources.push(val.numberJsResources);
            items.numberCssResources.push(val.numberCssResources);
            items.timestamps.push(val.timestamp);
        });

        var total = that.getTotalBytesTransferred(items.totalRequestBytes,
                                                  items.htmlResponseBytes,
                                                  items.cssResponseBytes,
                                                  items.imageResponseBytes,
                                                  items.javascriptResponseBytes,
                                                  items.otherResponseBytes,
                                                  items.totalRequestBytes);

        var fix = (total < 0.1) ? 2 : 1;

        $('#connections-size').html(total.toFixed(fix));

        getChart('#34495E', items.numberResources, items.timestamps, '#chart-numberResources', "numberResources");

        getChart('#34495E', items.numberHosts, items.timestamps, '#chart-numberHosts', "numberHosts");

        getChart('#34495E', items.totalRequestBytes, items.timestamps, '#chart-totalRequestBytes', "totalRequestBytes");

        getChart('#34495E', items.cssResponseBytes, items.timestamps, '#chart-cssResponseBytes', "cssResponseBytes");

        getChart('#34495E', items.htmlResponseBytes, items.timestamps, '#chart-htmlResponseBytes', "htmlResponseBytes");

        getChart('#34495E', items.imageResponseBytes, items.timestamps, '#chart-imageResponseBytes', "imageResponseBytes");

        getChart('#34495E', items.numberStaticResources, items.timestamps, '#chart-numberStaticResources', "numberStaticResources");

        getChart('#34495E', items.javascriptResponseBytes, items.timestamps, '#chart-javascriptResponseBytes', "javascriptResponseBytes");

        getChart('#34495E', items.otherResponseBytes, items.timestamps, '#chart-otherResponseBytes', "otherResponseBytes");

        getChart('#34495E', items.numberJsResources, items.timestamps, '#chart-numberJsResources', "numberJsResources");

        getChart('#34495E', items.numberCssResources, items.timestamps, '#chart-numberCssResources', "numberCssResources");
    });

};
