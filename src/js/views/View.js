export default class View {
  _clear() {
    this._parentElement.innerHTML = '';
  }

  _renderBasic() {
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
