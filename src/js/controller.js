import * as model from './model.js';
import mainView from './views/mainView.js';
// import calcView from './views/calcView.js';
import calcViewInput from './views/calcViewInput.js';
import calcViewChart from './views/calcViewChart.js';
import calcViewTable from './views/calcViewTable.js';

const controlMain = function () {
  mainView.render();
  calcViewInput.render(model.state);

  calcViewInput.addHandlerCalcNav(controlCalc);
};

const controlCalc = function (view) {
  if (view === 'input') calcViewInput.render(model.state);
  if (view === 'chart') calcViewChart.render(model.state);
  if (view === 'table') calcViewTable.render(model.state);
};

const init = function () {
  mainView.addHandlerMainContainer(controlMain);
};
init();
