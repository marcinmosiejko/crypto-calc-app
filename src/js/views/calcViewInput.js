import calcView from './calcView';

class CalcViewInput extends calcView {
  addHandlerCalcNav(handler) {
    const calcNavElement = document.querySelector('.calc-nav');

    // If there's no calc element (other page then calc clicked), do NOT add event listener
    if (!calcNavElement) return;

    calcNavElement.addEventListener('click', e => {
      const btn = e.target;

      document
        .querySelectorAll('.btn-calc-nav')
        .forEach(el => el.classList.remove('btn-calc-nav--active'));

      btn.classList.add('btn-calc-nav--active');

      const view = btn.textContent;
      handler(view);
    });
  }

  addHandlerForm(handler) {
    // If there's no calc element (other page then calc clicked), do NOT add event listener
    if (!this._parentElement) return;

    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      const form = e.target.closest('form');

      const formData = Object.fromEntries([...new FormData(form)]);

      handler(formData);
    });
  }

  _generateMarkup() {
    const { userInput, summary, oldestDataAvailable } = this._data;

    return `
            <div class="input-summary-view">
                <form class="form">
                <div class="input-amount">
                    <label for="investing">If I invested USD</label>
                    <input
                    id="investing"
                    type="number"
                    placeholder="100$"
                    name="investing"
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
                        value="bitcoin"
                        name="crypto"
                        required
                        ${userInput.crypto === 'bitcoin' ? 'checked' : ''}
                        /><span>BTC</span></label
                    >

                    <label for="eth">
                        <input
                        id="eth"
                        type="radio"
                        value="ethereum"
                        name="crypto"
                        ${userInput.crypto === 'ethereum' ? 'checked' : ''}
                        /><span>ETH</span></label
                    >

                    <label for="bnb">
                        <input
                        id="bnb"
                        type="radio"
                        value="binancecoin"
                        name="crypto"
                        ${userInput.crypto === 'binancecoin' ? 'checked' : ''}
                        /><span>BNB</span>
                    </label>

                    <label for="sol">
                        <input
                        id="sol"
                        type="radio"
                        value="solana"
                        name="crypto"
                        ${userInput.crypto === 'solana' ? 'checked' : ''}
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
                        value="1m"
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
                        >oldest available date: ${
                          oldestDataAvailable[`${userInput.crypto}`]
                        }</span
                    ></label
                    >
                    <input
                    id="date"
                    type="date"
                    name="startingDate"
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
                    <span class="summary-description">
                        value
                    </span>
                    <span class="summary-number">
                       0
                        <span class="symbol">$</span>
                    </span>
                </div>
                <div class="invested">
                    <span class="summary-description">
                        invested
                    </span>
                    <span class="summary-number">
                        0
                        <span class="symbol">$</span>
                    </span>
                </div>
                <div class="roi">
                    <span class="summary-description">
                        ROI
                    </span>
                    <span class="summary-number">
                        0
                        <span class="symbol">%</span>
                    <span>
                </div>
            </div>
            <div class="summary-additional">
                <div class="crypto">
                    <span class="summary-description">
                        crypto
                    </span>
                    <span class="summary-number">
                    0
                    </span>
                </div>
                <div class="investments">
                    <span class="summary-description">
                        investments
                    </span>
                    <span class="summary-number">
                       0
                    </span>
                </div>
            </div>
          `;
  }
}

export default new CalcViewInput();
