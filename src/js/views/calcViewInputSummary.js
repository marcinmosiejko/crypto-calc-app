import calcView from './calcView.js';

class CalcViewInputSummary extends calcView {
  _data;
  render(data) {
    this._data = data;
    this._parentElement = document.querySelector('.summary');

    // If there's no data (form yet not submitted) or no parent element (other page then calc clicked)
    if (!this._data || !this._parentElement) return;

    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup() {
    const { summary, userInput } = this._data;
    return `
            <div class="summary-main">
                <div class="value">
                    <span class="summary-description">
                        value
                    </span>
                    <span class="summary-number">
                        ${summary.value.toFixed(2)}
                        <span class="symbol">$</span>
                    </span>
                </div>
                <div class="invested">
                    <span class="summary-description">
                        invested
                    </span>
                    <span class="summary-number">
                        ${summary.invested.toFixed(2)}
                        <span class="symbol">$</span>
                    </span>
                </div>
                <div class="roi">
                    <span class="summary-description">
                        ROI
                    </span>
                    <span class="summary-number">
                        ${summary.roi.toFixed(0)}
                        <span class="symbol">%</span>
                    <span>
                </div>
            </div>
            <div class="summary-additional">
                <div class="crypto">
                    <span class="summary-description">
                        ${userInput.crypto}
                    </span>
                    <span class="summary-number">
                    ${summary.totalCryptoAmount}
                    </span>
                </div>
                <div class="investments">
                    <span class="summary-description">
                        investments
                    </span>
                    <span class="summary-number">
                        ${summary.investments}
                    </span>
                </div>
            </div>
    `;
  }
}

export default new CalcViewInputSummary();
