import * as model from './model.js';
import mainView from './views/mainView.js';
import calcView from './views/calcView.js';

const controlMain = function () {
  mainView.render(model.state);
  calcView.render(model.state);
  //   calcView.render(model.state);
};

const init = function () {
  mainView.addHandlerMainContainer(controlMain);
};
init();
