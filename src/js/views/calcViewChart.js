import calcView from './calcView';
import Chart from 'chart.js/auto';

class CalcViewChart extends calcView {
  render(chartData) {
    // if (!chartData) return;
    this._data = chartData;
    this._parentElement = document.querySelector('.calc');

    // Render canvas for the chart
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
    const canvas = document.querySelector('.chart');

    // Render chart
    Chart.defaults.font.family = `'Rubik', sans-serif`;
    Chart.defaults.color = `#343a40`;
    const config = {
      type: 'line',
      data: chartData,
      options: {
        plugins: {
          legend: {
            labels: {
              font: {
                weight: 500,
              },
              boxWidth: 32,
            },
          },
        },
        scales: {
          y: {
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, ticks) {
                return `${value} $`;
              },
            },
          },
        },
      },
    };

    const chart = new Chart(canvas, config);
  }
  _generateMarkup() {
    return `
            <div class="chart-view">
            <canvas class="chart"></canvas>
            </div>
            `;
  }
}

export default new CalcViewChart();
