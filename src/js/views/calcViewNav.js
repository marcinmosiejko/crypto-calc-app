import View from './View.js';

class CalcViewNav extends View {
  _data;
  _parentElement;

  addHandlerCalcNav(handler) {
    if (!this._parentElement) return;

    this._parentElement.addEventListener('click', e => {
      const btn = e.target;

      document
        .querySelectorAll('.btn-calc-nav')
        .forEach(el => el.classList.remove('btn-calc-nav--active'));

      btn.classList.add('btn-calc-nav--active');

      const view = btn.textContent;

      handler(view);
    });
  }

  render(data) {
    this._data = data;
    this._parentElement = document.querySelector('.calc-nav');

    // If there's no data (form yet not submitted) or no parent element (other page then calc clicked)
    if (!this._parentElement) return;

    this._renderBasic();
  }

  hide() {
    if (this._parentElement) this._clear();
  }

  _generateMarkup() {
    const { mobile, calcView } = this._data;

    return `
            <button class="btn-calc-nav ${
              calcView === 'input' || calcView === 'summary'
                ? 'btn-calc-nav--active'
                : ''
            }">${mobile ? 'summary' : 'input'}</button>
            <button class="btn-calc-nav ${
              calcView === 'chart' ? 'btn-calc-nav--active' : ''
            }">chart</button>
            <button class="btn-calc-nav ${
              calcView === 'table' ? 'btn-calc-nav--active' : ''
            }">table</button>
        `;
  }
}

export default new CalcViewNav();
