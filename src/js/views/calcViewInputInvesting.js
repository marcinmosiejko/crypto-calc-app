import calcView from './calcView.js';

class CalcViewInputInvesting extends calcView {
  _parentElement;

  addHandlerInputInvesting(handler) {
    this._parentElement = document.querySelector('#investing');

    if (!this._parentElement) return;

    // Mobile view > summary spinner error box > back to input button
    this._parentElement.addEventListener('input', e => {
      const input = e.target.value;
      handler(input);
    });
  }

  update(investing) {
    this._parentElement.value = investing;
  }

  _generateMarkup() {
    if (this._content === 'spinner')
      return `

            `;
  }
}

export default new CalcViewInputInvesting();
