import Chart from 'chart.js'
import React, {Component} from 'react';
// var chart = new Chart;
// var ee = require('events').EventEmitter;
// var datasource = new ee;

// chart.series(datasource);
// chart.to(document.getElementById('mychart'));
 
// setInterval(function() {
//     var random = Math.floor(Math.random()*100);
//     datasource.emit('data',{y:random});
// },1000);

export class CharTest extends Component {

    constructor(props) {
        super(props);

        this.state = {
           page:[]
        }

    }
    componentDidMount() {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["12:20", '15:30', '17:30', '18:20', '19:30', '21:30'],
                datasets: [{
                    label: 'כמות פירות',
                    data: [12, 19, 3, 5, 2, 3],
                    
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        })
        
    }
    render(){
        return <canvas id="myChart" width={"50%"} height={"50%"}></canvas>
    }
}

