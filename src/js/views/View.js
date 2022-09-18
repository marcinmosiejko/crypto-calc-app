export default class View {
  _mobile;
  _parentElement;

  renderInputError(isCorrect) {
    if (!this._parentElement) return;

    if (isCorrect) this._parentElement.classList.remove('error');
    if (!isCorrect) this._parentElement.classList.add('error');
  }

  _renderBasic(generator) {
    const markup = generator ? generator() : this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
