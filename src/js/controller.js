import * as model from './model.js';
import mainView from './views/mainView.js';
// import calcView from './views/calcView.js';
import calcViewInput from './views/calcViewInput.js';
import calcViewChart from './views/calcViewChart.js';
import calcViewTable from './views/calcViewTable.js';
import calcViewSummary from './views/calcViewSummary.js';
import calcViewErrorAndSpinner from './views/calcViewErrorAndSpinner.js';
import calcViewNav from './views/calcViewNav.js';

const controlMain = function () {
  mainView.render();

  calcViewInput.render(model.state);
  //  Render summary and calc nav only when form was already submitted and data successfuly fetched at least once
  if (model.state.formSubmitted) {
    if (!model.state.mobile) calcViewSummary.render(model.state);
    if (model.state.mobile) renderBackToInputBtn();

    calcViewNav.render(model.state.mobile);
    calcViewNav.addHandlerCalcNav(controlCalcView);
  }

  calcViewInput.addHandlerForm(controlForm);
  calcViewInput.addHandlerUpdateOldestDate(controlOldestDate);
};

const controlCalcView = function (view) {
  if (view === 'input') calcViewInput.render(model.state);
  // Render summary only when form was already submitted at least once
  // (won't get rendered if there's no input page due to guard clause in render method)
  if (model.state.formSubmitted) calcViewSummary.render(model.state);
  // Render back-to-input button only when on mobile
  if (model.state.mobile) renderBackToInputBtn();

  if (view === 'chart') {
    model.createChartDataObject();
    calcViewChart.render(model.state);
  }

  if (view === 'table') calcViewTable.render(model.state);
};

const controlForm = async function (formData) {
  try {
    calcViewNav.hide();
    calcViewErrorAndSpinner.render('spinner');

    model.validateUserInput(formData);

    model.createUserInputObject(formData);

    await model.loadAPIData();

    // calcViewInput.render(model.state);
    calcViewSummary.render(model.state);
    if (model.state.mobile) renderBackToInputBtn();

    calcViewNav.render(model.state.mobile);
    calcViewNav.addHandlerCalcNav(controlCalcView);
  } catch (err) {
    console.error(`--------------${err}--------------`);
    // if (!model.state.mobile) calcViewSummary.render(model.state);
    calcViewErrorAndSpinner.render(err.message);
  }
};

const controlOldestDate = function (selectedCrypto) {
  calcViewInput.updateOldestDate(
    model.state.oldestDataAvailable,
    selectedCrypto
  );
};

const controlMainElementResize = function (calcWidth) {
  model.updateMobileView(calcWidth);
  calcViewInput.render(model.state);
  // Render summary only when form was already submitted at least once
  // (won't get rendered if there's no input page due to guard clause in render method)
  if (model.state.formSubmitted) {
    calcViewSummary.render(model.state);
    // After screen resize, for some reason makes chart and table view load for a long time
    calcViewNav.render(model.state.mobile);
    calcViewNav.addHandlerCalcNav(controlCalcView);
  }

  if (model.state.mobile) renderBackToInputBtn();
};

const controlMobileBackToInput = function () {
  calcViewInput.render(model.state);
};

const renderBackToInputBtn = function () {
  calcViewErrorAndSpinner.render('button');
  calcViewErrorAndSpinner.addHandlerMobileBackToInput(controlMobileBackToInput);
};

const init = function () {
  mainView.addHandlerMainContainer(controlMain);
  mainView.addHandlerMainElementResize(controlMainElementResize);
};
init();
