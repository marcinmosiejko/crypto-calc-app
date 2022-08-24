import * as model from './model.js';
import mainView from './views/mainView.js';

const controlMain = function (page) {
  mainView.render(page, model.state);
  //   calcView.render(model.state);
};

const init = function () {
  mainView.addHandlerMainContainer(controlMain);
};
init();
