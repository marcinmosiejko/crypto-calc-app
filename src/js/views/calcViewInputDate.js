import calcView from './calcView.js';

class CalcViewInputDate extends calcView {
  _parentElement;

  addHandlerInputDate(handler) {
    this._parentElement = document.querySelector('#date');

    if (!this._parentElement) return;

    // Mobile view > summary spinner error box > back to input button
    this._parentElement.addEventListener('input', e => {
      const input = e.target.value;
      handler(input);
    });
  }

  update(date) {
    this._parentElement.value = date;
  }

  _generateMarkup() {
    if (this._content === 'spinner')
      return `

            `;
  }
}

export default new CalcViewInputDate();
