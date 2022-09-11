import View from './View.js';

class CalcViewForm extends View {
  addHandlerForm(handler) {
    this._parentElement = document.querySelector('.calc');
    // If there's no calc element (other page then calc clicked), do NOT add event listener
    if (!this._parentElement) return;

    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      const form = e.target.closest('form');

      const formData = Object.fromEntries([...new FormData(form)]);
      handler(formData);
    });
  }

  addHandlerUpdateOldestDate(handler) {
    const cryptoButtonsElement = document.querySelector('.input-btn--crypto');

    if (!cryptoButtonsElement) return;

    cryptoButtonsElement.addEventListener('click', e => {
      const btn = e.target.closest('input');

      // Not sure why this event fires twice, first with btn = null then with btn = clicked element
      if (!btn) return;

      const selectedCrypto = btn.value;

      handler(selectedCrypto);
    });
  }

  updateOldestDate(oldestDateAvailable, selectedCrypto) {
    const oldestDateElement = document.querySelector('.oldest-date');
    oldestDateElement.textContent = `${oldestDateAvailable[selectedCrypto]}`;
  }
}

export default new CalcViewForm();
