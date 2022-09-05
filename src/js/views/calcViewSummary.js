import calcView from './calcView.js';

class CalcViewSummary extends calcView {
  _data;
  _parentElement;
  render(data) {
    this._data = data;
    this._mobile = this._data.mobile;

    if (this._mobile) this._parentElement = document.querySelector('.calc');
    if (!this._mobile) this._parentElement = document.querySelector('.summary');

    // If there's no data (form yet not submitted) or no parent element (other page then calc clicked)
    if (!this._data || !this._parentElement) return;

    this._renderBasic();
  }

  _generateMarkup() {
    const { summary, userLocale } = this._data;
    return `
        ${
          this._mobile
            ? `<div class="input-summary-view"><div class="summary">`
            : ``
        }
            <div class="summary-main">
                <div class="value">
                    <span class="summary-description">
                        value
                    </span>
                    <span class="summary-number">
                        ${this._formatNumber(
                          Math.round(summary.value),
                          userLocale
                        )}
                        <span class="symbol">$</span>
                    </span>
                </div>
                <div class="invested">
                    <span class="summary-description">
                        invested
                    </span>
                    <span class="summary-number">
                        ${this._formatNumber(
                          Math.round(summary.invested),
                          userLocale
                        )}
                        <span class="symbol">$</span>
                    </span>
                </div>
                <div class="roi">
                    <span class="summary-description">
                        ROI
                    </span>
                    <span class="summary-number">
                        ${summary.roi}
                        <span class="symbol">%</span>
                    <span>
                </div>
            </div>
            <div class="summary-additional">
                <div class="crypto">
                    <span class="summary-description">
                        crypto amount
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
            <div class="summary-button-spinner-error">
            </div>
        ${this._mobile ? `</div></div>` : ``}
            `;
  }
}

export default new CalcViewSummary();
