const vm = new Vue({
    el: '#app',
    data: {
        results: [],
        chartsdata: []
    },
    methods: {
        newDate: function (d) {
            return moment().add(d, 'd');
        }
    },
    mounted() {
        axios.get("https://api.covid19india.org/data.json")
            .then(response => {
                this.results = response.data.statewise
                this.chartsdata = response.data.cases_time_series.reverse()
                let config = {
                    type: 'line',
                    data: {
                        labels: [
                            moment().subtract(6, 'days').format('DD MMMM'),
                            moment().subtract(5, 'days').format('DD MMMM'),
                            moment().subtract(4, 'days').format('DD MMMM'),
                            moment().subtract(3, 'days').format('DD MMMM'),
                            moment().subtract(2, 'days').format('DD MMMM'),
                            moment().subtract(1, 'days').format('DD MMMM')],
                        datasets: [{
                            label: 'New cases',
                            backgroundColor: '#E64A35',
                            borderColor: '#E64A35',
                            data: [
                                this.chartsdata[5].dailyconfirmed,
                                this.chartsdata[4].dailyconfirmed,
                                this.chartsdata[3].dailyconfirmed,
                                this.chartsdata[2].dailyconfirmed,
                                this.chartsdata[1].dailyconfirmed,
                                this.chartsdata[0].dailyconfirmed
                            ],
                            fill: false,
                        }, {
                            label: 'New recoveries',
                            fill: false,
                            backgroundColor: 'green',
                            borderColor: 'green',
                            data: [
                                this.chartsdata[5].dailyrecovered,
                                this.chartsdata[4].dailyrecovered,
                                this.chartsdata[3].dailyrecovered,
                                this.chartsdata[2].dailyrecovered,
                                this.chartsdata[1].dailyrecovered,
                                this.chartsdata[0].dailyrecovered
                            ],
                        }]
                    },
                    options: {
                        responsive: true,
                        title: {
                            display: true,
                            text: 'Daily changes'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Time'
                                },
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Cases'
                                }
                            }]
                        }
                    }
                };

                let ctx = document.getElementById('canvas').getContext('2d');
                window.myLine = new Chart(ctx, config);
            })
    }
})