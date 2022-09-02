import * as model from './model.js';
import mainView from './views/mainView.js';
// import calcView from './views/calcView.js';
import calcViewInput from './views/calcViewInput.js';
import calcViewChart from './views/calcViewChart.js';
import calcViewTable from './views/calcViewTable.js';
import calcViewNav from './views/calcViewNav.js';
import CalcViewSummary from './views/calcViewSummary.js';

const controlMain = function () {
  mainView.render();
  calcViewInput.render(model.state);
  //  Render summary only when form was already submitted at least once
  if (model.state.formSubmitted) CalcViewSummary.render(model.state);

  calcViewInput.addHandlerForm(controlForm);
  calcViewInput.addHandlerUpdateOldestDate(controlOldestDate);
};

const controlCalcView = function (view) {
  if (view === 'input') calcViewInput.render(model.state);
  // Render summary only when form was already submitted at least once
  // (won't get rendered if there's no input page due to guard clause in render method)
  if (model.state.formSubmitted) CalcViewSummary.render(model.state);

  if (view === 'chart') {
    model.createChartDataObject();
    calcViewChart.render(model.state.chartData);
  }
  if (view === 'table') calcViewTable.render(model.state);
};

const controlForm = async function (formData) {
  try {
    calcViewNav.hide();

    if (!model.validateUserInput(formData))
      throw new Error('Incorrect input ;(');

    model.createUserInputObject(formData);

    await model.loadAPIData();

    // calcViewInput.render(model.state);
    CalcViewSummary.render(model.state);

    calcViewNav.render();
    calcViewNav.addHandlerCalcNav(controlCalcView);
  } catch (err) {
    console.error(`--------------${err}`);
  }
};

const controlOldestDate = function (selectedCrypto) {
  calcViewInput.updateOldestDate(
    model.state.oldestDataAvailable,
    selectedCrypto
  );
};

const init = function () {
  mainView.addHandlerMainContainer(controlMain);
};
init();
