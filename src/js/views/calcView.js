import View from './View.js';

export default class CalcView extends View {
  _data;
  _parentElement;
  _inputView;

  render(data) {
    this._data = data;
    this._parentElement = document.querySelector('.calc');

    // If there's no calc element (other page then calc clicked), do NOT render calc view (calcViewInput)
    if (!this._parentElement) return;

    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderInputError(isCorrect) {
    if (!this._parentElement) return;

    if (isCorrect) this._parentElement.classList.remove('error');
    if (!isCorrect) this._parentElement.classList.add('error');
  }
}
