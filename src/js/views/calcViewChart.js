import calcView from './calcView';

class CalcViewChart extends calcView {
  _generateMarkup() {
    return `
            <div class="chart-view">
            </div>
            `;
  }
}

export default new CalcViewChart();
