import calcView from './calcView';

class CalcViewInput extends calcView {
  addHandlerCalcNav(handler) {
    this._calcNavElement = document.querySelector('.calc-nav');

    if (!this._calcNavElement) return;

    this._calcNavElement.addEventListener('click', e => {
      const btn = e.target;

      document
        .querySelectorAll('.btn-calc-nav')
        .forEach(el => el.classList.remove('btn-calc-nav--active'));

      btn.classList.add('btn-calc-nav--active');

      const view = btn.textContent;
      handler(view);
    });
  }

  _generateMarkup() {
    const { userInput, dataAPI, summary } = this._data;
    return `
            <div class="input-summary-view">
                <form class="form">
                <div class="input-amount">
                    <label for="invested">If I invested USD</label>
                    <input
                    id="invested"
                    type="text"
                    placeholder="100$"
                    name="invested"
                    value="${userInput.investing}"
                    required
                    />
                </div>

                <div class="input-btn input-btn--crypto">
                    <p class="label-btn">into</p>
                    <div class="flex-btn">
                    <label for="btc">
                        <input
                        id="btc"
                        type="radio"
                        value="btc"
                        name="crypto"
                        required
                        ${userInput.crypto === 'btc' ? 'checked' : ''}
                        /><span>BTC</span></label
                    >

                    <label for="eth">
                        <input
                        id="eth"
                        type="radio"
                        value="eth"
                        name="crypto"
                        ${userInput.crypto === 'eth' ? 'checked' : ''}
                        /><span>ETH</span></label
                    >

                    <label for="bnb">
                        <input
                        id="bnb"
                        type="radio"
                        value="bnb"
                        name="crypto"
                        ${userInput.crypto === 'bnb' ? 'checked' : ''}
                        /><span>BNB</span>
                    </label>

                    <label for="sol">
                        <input
                        id="sol"
                        type="radio"
                        value="sol"
                        name="crypto"
                        ${userInput.crypto === 'sol' ? 'checked' : ''}
                        /><span>SOL</span></label
                    >
                    </div>
                </div>

                <div class="input-btn input-btn--interval">
                    <p class="label-btn">every</p>
                    <div class="flex-btn">
                    <label for="month">
                        <input
                        id="month"
                        type="radio"
                        value="month"
                        name="interval"
                        required
                        ${userInput.interval === '1m' ? 'checked' : ''}
                        /><span>month</span>
                    </label>

                    <label for="2 weeks">
                        <input
                        id="2 weeks"
                        type="radio"
                        value="2w"
                        name="interval"
                        ${userInput.interval === '2w' ? 'checked' : ''}
                        /><span>2 weeks</span></label
                    >

                    <label for="week">
                        <input
                        id="week"
                        type="radio"
                        value="1w"
                        name="interval"
                        ${userInput.interval === '1w' ? 'checked' : ''}
                        /><span>week</span></label
                    >
                    </div>
                </div>

                <div class="input-date">
                    <label for="date"
                    ><span>starting from</span
                    ><span class="oldest-date"
                        >oldest available date: ${dataAPI.oldestDate}</span
                    ></label
                    >
                    <input
                    id="date"
                    type="text"
                    name="date"
                    placeholder="28.04.2013"
                    value="${userInput.startingDate}"
                    required
                    />
                </div>

                <button type="submit" value="submit" class="btn btn--form">
                    CALC
                </button>
                </form>

                <div class="summary">
                <div class="summary-main">
                    <div class="value">
                    <span class="summary-description">value</span
                    ><span class="summary-number"
                        >${summary.value.toFixed(
                          2
                        )}<span class="symbol">$</span></span
                    >
                    </div>
                    <div class="invested">
                    <span class="summary-description">invested</span
                    ><span class="summary-number"
                        >${summary.invested.toFixed(
                          2
                        )}<span class="symbol">$</span></span
                    >
                    </div>
                </div>
                <div class="summary-additional">
                    <div class="roi">
                    <span class="summary-description">ROI</span
                    ><span class="summary-number"
                        >${summary.return}<span class="symbol">%</span></span
                    >
                    </div>
                    <div class="investments">
                    <span class="summary-description">investments</span
                    ><span class="summary-number">${summary.investments.toFixed(
                      2
                    )}</span>
                    </div>
                </div>
                </div>
            </div>
              
     
            
          `;
  }
}

export default new CalcViewInput();
