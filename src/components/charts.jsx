var Chart = require();

import Chart from 'chart'
var chart = new Chart;
var ee = require('events').EventEmitter;
var datasource = new ee;

chart.series(datasource);
chart.to(document.getElementById('mychart'));

setInterval(function() {
    var random = Math.floor(Math.random()*100);
    datasource.emit('data',{y:random});
},1000);