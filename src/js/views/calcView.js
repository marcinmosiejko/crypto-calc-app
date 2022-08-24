import View from './View.js';

export default class CalcView extends View {
  _data;
  _parentElement;
  _calcNavElement;

  render(data) {
    this._data = data;
    this._parentElement = document.querySelector('.calc');

    if (!this._parentElement) return;

    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkupChart() {
    return `
            <div class="chart-view"></div>
            `;
  }
}
