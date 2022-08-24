import View from './View.js';

class MainView extends View {
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

  render() {
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup() {
    if (this._currentPage === 'calc')
      return `
              <div class="calc-container">
                <div class="calc">
                
                </div>
                <nav class="calc-nav">
                  <button class="btn-calc-nav btn-calc-nav--active">input</button>
                  <button class="btn-calc-nav">chart</button>
                  <button class="btn-calc-nav">table</button>
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
  }
}

export default new MainView();
