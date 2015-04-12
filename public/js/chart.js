function getChart(items, svgId, timestamps) {
    var compound = !!(items.push); //poor man's isArray()

    if (!compound) {
        items = [items];
    }

    nv.addGraph(function() {
        var chart = nv.models.lineChart()
            .useInteractiveGuideline(compound)
            .useVoronoi(!compound)
            .showLegend(compound)
            .showXAxis(false)
            .height(240)
            .pointSize(10);

        chart.xAxis.tickFormat(function(d) {
            return d3.time.format("%d/%m/%Y %H:%M")(new Date(d));
        });

        chart.yAxis.tickFormat(function(n) {
            return (n < 1024)? n : (Math.round(n * 100 / 1024) / 100) + 'k';
        });

        d3.select(svgId)
            .datum(printChart(items, timestamps))
            .transition().duration(500)
            .call(chart);

        nv.utils.windowResize(chart.update);

        chart.dispatch.on('stateChange', function(e) {
            nv.log('New State:', JSON.stringify(e));
        });

        return chart;
    });
};

function printChart(items, timestamps) {
    var lines = [];
    var line, stamps;
    for (var i = 0; i < items.length; i++) {
        line = [];
        stamps = items[i].timestamps || timestamps;

        for (var p = 0; p < items[i].points.length; p++) {
            line.push({
                x: stamps[p],
                y: parseInt(items[i].points[p]||0, 10)
            });
        }

        lines.push({
            values: line,
            key: items[i].label,
            color: items[i].color
        });
    }

    return lines;
}