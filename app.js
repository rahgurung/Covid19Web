const vm = new Vue({
  el: '#app',
  data: {
    results: [],
    chartsdata: [],
    displaydays: 7,
  },
  methods: {
    newDate: function (d) {
      return moment().add(d, 'd')
    },
    updateDisplay: function (days) {
      this.displaydays = days

      axios.get('https://api.covid19india.org/data.json').then((response) => {
        this.results = response.data.statewise
        this.chartsdata = response.data.cases_time_series.reverse()

        const startDate = moment()
          .subtract(this.displaydays, 'days')
          .format('DD MMMM')

        const chartDisplay = this.chartsdata
          .filter((d, i) => moment(d.date).isSameOrAfter(startDate))
          .sort((a, b) => moment(a.date) - moment(b.date))

        const dailyConfirmed = chartDisplay.map((d) => d.dailyconfirmed)
        const dailyRecovered = chartDisplay.map((d) => d.dailyrecovered)

        const labels = chartDisplay.map((d) => d.date)

        window.myLine.data.labels = labels

        window.myLine.data.datasets = [
          {
            label: 'New cases',
            backgroundColor: '#E64A35',
            borderColor: '#E64A35',
            data: dailyConfirmed,
            fill: false,
          },
          {
            label: 'New recoveries',
            fill: false,
            backgroundColor: 'green',
            borderColor: 'green',
            data: dailyRecovered,
          },
        ]

        window.myLine.update()
      })
    },
  },
  mounted() {
    axios.get('https://api.covid19india.org/data.json').then((response) => {
      this.results = response.data.statewise
      this.chartsdata = response.data.cases_time_series.reverse()

      const startDate = moment()
        .subtract(this.displaydays, 'days')
        .format('DD MMMM')

      const chartDisplay = this.chartsdata
        .filter((d, i) => moment(d.date).isSameOrAfter(startDate))
        .sort((a, b) => moment(a.date) - moment(b.date))

      const dailyConfirmed = chartDisplay.map((d) => d.dailyconfirmed)
      const dailyRecovered = chartDisplay.map((d) => d.dailyrecovered)

      const labels = chartDisplay.map((d) => d.date)

      let config = {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'New cases',
              backgroundColor: '#E64A35',
              borderColor: '#E64A35',
              data: dailyConfirmed,
              fill: false,
            },
            {
              label: 'New recoveries',
              fill: false,
              backgroundColor: 'green',
              borderColor: 'green',
              data: dailyRecovered,
            },
          ],
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'Daily changes',
          },
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          hover: {
            mode: 'nearest',
            intersect: true,
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Time',
                },
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Cases',
                },
              },
            ],
          },
        },
      }

      let ctx = document.getElementById('canvas').getContext('2d')
      window.myLine = new Chart(ctx, config)
    })
  },
})
