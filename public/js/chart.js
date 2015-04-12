function getChart(colorRGBA, items, timestamps, svgId, labelTop) {

    var chart;

    nv.addGraph(function() {

        chart = nv.models.lineChart();

        chart.xAxis
            .axisLabel('Mouse over the points for details')
            .rotateLabels(0)
            .tickFormat(function(d) {

                return d3.time.format('%d/%m/%Y %H:%M:%S')(new Date(d));
            });

        d3.select(svgId + ' svg')
            .datum(printChart(colorRGBA))
            .transition().duration(500)
            .call(chart);

        nv.utils.windowResize(chart.update);

        chart.dispatch.on('stateChange', function(e) {
            nv.log('New State:', JSON.stringify(e));
        });

        return chart;
    });

    function printChart(colorRGBA) {

        var dataChart = [],
            wl = 0;

        for (var i = 0; i < items.length; i++) {

            var timestamp = timestamps[i];

            dataChart.push({
                x: timestamp,
                // dataChart.push({x: i,
                y: parseInt(items[i], 10)
            });
        }

        // debugger;
        return [{
            values: dataChart,
            key: labelTop,
            color: colorRGBA
        }];
    }

};