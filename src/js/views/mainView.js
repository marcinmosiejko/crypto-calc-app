class MainView {
  _data;
  _currentPage;
  _parentElement = document.querySelector('main');
  _mainNav = document.querySelector('.main-nav-list');
  _ctaButton = document.querySelector('.hero-btn');

  addHandlerMainContainer(handler) {
    // Main navigation functionality
    this._mainNav.addEventListener('click', e => {
      e.preventDefault();
      const btn = e.target.closest('.main-nav-link');

      if (!btn) return;

      this._mainNav
        .querySelectorAll('.main-nav-link')
        .forEach(el => el.classList.remove('main-nav-link--current'));
      btn.classList.add('main-nav-link--current');

      this._currentPage = btn.getAttribute('href').slice(1);

      handler(this._currentPage);
    });

    // CTA button functionality
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.hero-btn');

      if (!btn) return;

      this._mainNav.querySelector('.main-nav-link[href="#calc"]');
      this._currentPage = 'calc';
      handler(this._currentPage);
    });
  }

  render(page, data) {
    this._data = data;

    if (page) this._renderPage();
    if (page !== 'calc') return;

    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _renderPage() {
    const markup = this._generatePageMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  _generatePageMarkup() {
    if (this._currentPage === 'calc')
      return `
              <div class="calc-container">
                <div class="calc">
                </div>
              </div>
          `;

    if (this._currentPage === 'take-action')
      return `
      <div class="take-action-container">
      Take action
      </div>
            `;

    if (this._currentPage === 'contact')
      return `
            <div class="contact-container">
              Contact
            </div>
            `;
  }

  _generateMarkup() {
    return `
          <div class="calc-container">
            <div class="calc">
              <div class="input-summary-view">
                <form class="form">
                  <div class="input-amount">
                    <label for="invested">If I invested USD</label>
                    <input
                      id="invested"
                      type="text"
                      placeholder="100$"
                      name="invested"
                      value="100"
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
                          checked
                        /><span>BTC</span></label
                      >

                      <label for="eth">
                        <input
                          id="eth"
                          type="radio"
                          value="eth"
                          name="crypto"
                        /><span>ETH</span></label
                      >

                      <label for="bnb">
                        <input
                          id="bnb"
                          type="radio"
                          value="bnb"
                          name="crypto"
                        /><span>BNB</span>
                      </label>

                      <label for="sol">
                        <input
                          id="sol"
                          type="radio"
                          value="sol"
                          name="crypto"
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
                          checked
                        /><span>month</span>
                      </label>

                      <label for="2 weeks">
                        <input
                          id="2 weeks"
                          type="radio"
                          value="2 weeks"
                          name="interval"
                        /><span>2 weeks</span></label
                      >

                      <label for="week">
                        <input
                          id="week"
                          type="radio"
                          value="week"
                          name="interval"
                          required
                        /><span>week</span></label
                      >
                    </div>
                  </div>

                  <div class="input-date">
                    <label for="date"
                      ><span>starting from</span
                      ><span class="oldest-date"
                        >oldest available date: 28.04.2013</span
                      ></label
                    >
                    <input
                      id="date"
                      type="text"
                      name="date"
                      placeholder="28.04.2013"
                      value="28.04.2013"
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
                        >1,865,670.00<span class="symbol">$</span></span
                      >
                    </div>
                    <div class="invested">
                      <span class="summary-description">invested</span
                      ><span class="summary-number"
                        >789.00<span class="symbol">$</span></span
                      >
                    </div>
                  </div>
                <div class="summary-additional">
                  <div class="roi">
                    <span class="summary-description">ROI</span
                    ><span class="summary-number"
                      >3956<span class="symbol">%</span></span
                    >
                  </div>
                  <div class="investments">
                    <span class="summary-description">investments</span
                    ><span class="summary-number">11</span>
                  </div>
                </div>
              </div>
            </div>
            </div>
          <nav class="secondary-nav">
            <button class="btn-secondary-nav btn-secondary-nav--active">
              input
            </button>
            <button class="btn-secondary-nav">chart</button>
            <button class="btn-secondary-nav">table</button>
          </nav>
        </div>
            
          `;
  }
}

export default new MainView();
