import View from './View.js';

export default class CalcView extends View {
  _data;
  _parentElement;

  render(data) {
    this._data = data;
    this._parentElement = document.querySelector('.calc');

    // If there's no calc element (other page then calc clicked), do NOT render calc view (calcViewInput)
    if (!this._parentElement) return;

    const markup = this._generateMarkup();

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //   render(data) {
  //     this._data = data;
  //     console.log(this._parentElement);
  //     if (!this._parentElement)
  //       this._parentElement = document.querySelector('.calc');
  //     console.log(this._parentElement);

  //     const markup = this._generateMarkup();
  //     this._clear();
  //     this._parentElement.insertAdjacentHTML('afterbegin', markup);
  //   }
}
