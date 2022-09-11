import View from './View.js';

class CalcViewSummary extends View {
  _data;
  _parentElement;

  render(data) {
    this._data = data;
    const { calcView, mobile } = this._data;
    this._mobile = mobile;

    // Without this guard clause, when in mobile view it would render summary after rendeing chart or table resulting no chart or table to be shown to user
    if (
      (calcView !== 'input' || calcView !== 'summary') &&
      (calcView === 'chart' || calcView === 'table')
    )
      return;

    if (mobile) this._parentElement = document.querySelector('.calc');
    if (!mobile) this._parentElement = document.querySelector('.summary');

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
