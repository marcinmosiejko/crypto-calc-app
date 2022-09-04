import View from './View.js';

class MainView extends View {
  _currentPage;
  _parentElement = document.querySelector('main');
  _mainNav = document.querySelector('.main-nav-list');
  _ctaButton = document.querySelector('.hero-btn');
  _mainWidth;

  addHandlerMainContainer(handler) {
    // Main navigation functionality on reload and link click
    ['load', 'hashchange'].forEach(ev => {
      window.addEventListener(ev, e => {
        this._currentPage = window.location.hash.slice(1);

        // Remove selected style from all clicked elements
        this._mainNav
          .querySelectorAll('.main-nav-link')
          .forEach(el => el.classList.remove('main-nav-link--current'));

        // If other page clicked then home page (there's a hash), add selected style to clicked element
        if (this._currentPage)
          document
            .querySelector(`.main-nav-link[href="#${this._currentPage}"]`)
            ?.classList.add('main-nav-link--current');

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
    this._renderBasic();
  }

  _generateMarkup() {
    if (!this._currentPage)
      return `
            <div class="hero-container">
              <div class="main-text">
                <h1 class="heading-primary">What if</h1>
                <p class="hero-description">
                  you were investing a small amount of money on a regular basis in
                </p>
                <h1 class="heading-primary">crypto?</h1>
                <div class="hero-btn">
                  <a href="#calc">let's find out</a>
                </div>
              </div>
            </div>
            `;

    if (this._currentPage === 'calc')
      return `
              <div class="calc-container">
                <div class="calc">
                </div>
                <nav class="calc-nav">
                  
                </nav>
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

    if (this._currentPage) return '';
    // return `
    //       <div class="hero-container">
    //         <div class="main-text">
    //           <p class="hero-description">page not found
    //           </p>
    //         </div>
    //       </div>
    //       `;
  }
}

export default new MainView();
