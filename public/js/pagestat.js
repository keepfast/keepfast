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

    var router = '/pagestats/url/%url%/all.json'.replace('%url%', url);
    var that = this;

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

        var colors = { //based on FlatUI swatches
            total: '#34495E', //wet asphalt
            html: '#F1C40F', //sunflower
            css: '#16A085', //green sea
            js: '#C0392B', //pomegranate
            img: '#2980B9', //belize hole
            requests: '#9B59B6', //amethyst
            others: '#95A5A6' //concrete
        }

        getChart({
            label: 'Hosts',
            color: '#34495E',
            points: items.numberHosts,
            timestamps: items.timestamps
        }, '#chart-numberHosts');
        
        getChart([
            {
                label: 'Total',
                color: colors.total,
                points: items.numberResources
            }, {
                label: 'Static (cacheable)',
                color: colors.others,
                points: items.numberStaticResources
            }, {
                label: 'Style resources',
                color: colors.css,
                points: items.numberCssResources
            }, {
                label: 'Script resources',
                color: colors.js,
                points: items.numberJsResources
            }
        ], '#chart-numberResources', items.timestamps);

        getChart([
            {
                label: 'Markup',
                color: colors.html,
                points: items.htmlResponseBytes
            }, {
                label: 'Styles',
                color: colors.css,
                points: items.cssResponseBytes
            }, {
                label: 'Scripts',
                color: colors.js,
                points: items.javascriptResponseBytes
            }, {
                label: 'Images',
                color: colors.img,
                points: items.imageResponseBytes
            },{
                label: 'Requests',
                color: colors.requests,
                points: items.totalRequestBytes
            }, {
                label: 'Others',
                color: colors.others,
                points: items.numberStaticResources
            }
        ], '#chart-weightResources', items.timestamps);
    });

};
