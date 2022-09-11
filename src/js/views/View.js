export default class View {
  _mobile;
  _parentElement;
  _clear() {
    this._parentElement.innerHTML = '';
  }

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

  _formatNumber(number, locale) {
    return new Intl.NumberFormat([locale, 'en-US'], {
      style: 'decimal',
      minimumFractionDigits: 2,
    }).format(number);
  }

  _formatDate(date, locale, dayFormat = '2-digit', yearFormat = 'numeric') {
    const options = {
      day: dayFormat,
      month: '2-digit',
      year: yearFormat,
    };

    if (!dayFormat) delete options.day;

    return Intl.DateTimeFormat([locale, 'en-US'], options).format(date);
  }
}
