import View from './View.js';

class MainView extends View {
  _currentPage;
  _mainWidth;
  _containerElement = document.querySelector('.container');
  _mainNavElement = document.querySelector('.main-nav-list');
  _parentElement = document.querySelector('main');
  _footerYearElement = document.querySelector('.footer-year');

  addHandlerMainContainer(handler) {
    // Main navigation functionality on reload and main nav link click
    ['load', 'hashchange'].forEach(ev => {
      window.addEventListener(ev, e => {
        this._currentPage = window.location.hash.slice(1);

        // Remove selected style from all clicked elements
        this._mainNavElement
          .querySelectorAll('.main-nav-link')
          .forEach(el => el.classList.remove('main-nav-link--current'));

        // If other page clicked then home page (there's a hash), add selected style to clicked element
        if (this._currentPage) {
          document
            .querySelector(`.main-nav-link[href="#${this._currentPage}"]`)
            ?.classList.add('main-nav-link--current');
          // deactivates align-self: center for main element
          this._containerElement.classList.remove('center');
        }

        // If home or calc page selected (no hash or hash = calc), add class=center to the container, which will allow for main element (_parentElement) to align-self: center and make home / calc page always centered
        if (!this._currentPage || this._currentPage === 'calc')
          this._containerElement.classList.add('center');

        handler();
      });
    });
  }

  addHandlerMainElementResize(handler) {
    const myObserver = new ResizeObserver(entries => {
      const mainWidth = entries[0].contentRect.width;

      // handle event only if width is changed (avoids firing when there's other metric change)
      if (mainWidth !== this._mainWidth) handler(mainWidth);
      this._mainWidth = mainWidth;
    });

    myObserver.observe(this._parentElement);
  }

  render() {
    if (this._currentPage)
      this._renderBasic(this._generateNotFoundPageMarkup.bind(this));
    if (!this._currentPage)
      this._renderBasic(this._generateHomePageMarkup.bind(this));
    if (this._currentPage === 'calc')
      this._renderBasic(this._generateCalcPageMarkup.bind(this));
    if (this._currentPage === 'take-action')
      this._renderBasic(this._generateTakeActionPageMarkup.bind(this));
    if (this._currentPage === 'contact')
      this._renderBasic(this._generateContactPageMarkup.bind(this));
  }

  _generateHomePageMarkup() {
    return `
              <div class="hero-container">
                <div class="main-text">
                  <h1 class="heading-primary">What if</h1>
                  <p class="hero-description">
                    you were investing a small amount of money on a regular basis in
                  </p>
                  <h1 class="heading-primary">crypto?</h1>
                  <div class="hero-btn">
                    <a class="link link--btn" href="#calc">let's find out</a>
                  </div>
                </div>
              </div>
            `;
  }
  _generateCalcPageMarkup() {
    return `
              <div class="calc-container">
                <div class="calc">
                </div>
                <nav class="calc-nav">
                  
                </nav>
              </div>
            `;
  }
  _generateTakeActionPageMarkup() {
    return `
              <div class="page-container">
                <header class="page-header">
                  <span class="title-intro">there are 2 things you need to</span>
                  <h1 class="heading-primary">start with crypto</h1>
                </header>

                <section class="page-main-section">
                  <div class="subsection-container">
                    <h2 class="heading-secondary heading-secondary--first">onramp</h2>
                    <p>
                      Most of the time it's an exchange that is used to buy cryptocurrency with dollars or any other fiat currency.
                    </p>
                    <p>
                      Binance and Coinbase are ones I use myself.
                    </p>
                    <div class="links-container">
                      <a class="link link--btn" href="https://www.coinbase.com/" target="_blank">coinbase</a>
                      <a class="link link--btn" href="https://www.binance.com/" target="_blank">binance</a>
                    </div>
                  </div>
                  <div class="subsection-container">
                    <h2 class="heading-secondary heading-secondary--second">wallet</h2>
                    <p>
                      <blockquote><em>"Not your keys, not your money."</em></blockquote>
                    </p>
                    <p>
                      Thats a popular saying in crypto that simply means, if you're not in custody of your cryptocurrency, you risk loosing it.
                    </p>
                    <p>
                      Safest way to store your cryptocurrency is to withdraw from an exchange to your pesonal hardware wallet.
                    </p>
                    <p>
                      Ledger is the most popular and probably safest hardware wallet available.
                    </p>
                    <div class="links-container">
                      <a class="link link--btn" href="https://www.ledger.com/" target="_blank">ledger</a>
                    </div>
                  </div>
                </section>
              </div>
            `;
  }
  _generateContactPageMarkup() {
    return `
              <div class="page-container contact">
                <header class="page-header">
                  <span class="title-intro">there are 2 ways to</span>
                  <h1 class="heading-primary">contact me</h1>
                </header>

                
                  <div class="subsection-container">
                    <div class="links-container">
                      <a class="link link--btn" href="https://twitter.com/mosiej803" target="_blank">twitter</a>
                      <a class="link link--btn" href="https://www.linkedin.com/in/marcin-mosiejko-45937051/" target="_blank">linkedin</a>
                    </div>
                  </div>
               
              </div>
            `;
  }

  _generateNotFoundPageMarkup() {
    return '';
  }
}

export default new MainView();
