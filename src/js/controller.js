import * as model from './model.js';
import mainView from './views/mainView.js';
import calcViewInput from './views/calcViewInput.js';
import calcViewInputInvesting from './views/calcViewInputInvesting.js';
import calcViewInputDate from './views/calcViewInputDate.js';
import calcViewSummary from './views/calcViewSummary.js';
import calcViewChart from './views/calcViewChart.js';
import calcViewTable from './views/calcViewTable.js';
import calcViewNav from './views/calcViewNav.js';
import calcViewButtonSpinnerError from './views/calcViewButtonSpinnerError.js';

const controlMain = function () {
  mainView.render();

  calcViewInputRenderAndAddHandlers();
  // Form handler only in controlMain as it's attached to the .calc element that doesn't get rerendered in other controllers
  calcViewInput.addHandlerForm(controlForm);
  //  Render summary and calc nav only when form was already submitted and data successfuly fetched at least once
  if (model.state.formSubmitted) {
    if (!model.state.mobile) calcViewSummary.render(model.state);
    if (model.state.mobile) renderBackToInputBtn();

    calcViewNav.render(model.state.mobile);
    calcViewNav.addHandlerCalcNav(controlCalcView);
  }
};

const controlCalcView = function (view) {
  model.updateCalcView(view);
  if (view === 'input' || view === 'summary') {
    calcViewInputRenderAndAddHandlers();
    // Render summary only when form was already submitted at least once
    // (won't get rendered if there's no input page due to guard clause in render method)
    if (model.state.formSubmitted) calcViewSummary.render(model.state);
    // Render back-to-input button only when on mobile
    if (model.state.mobile) renderBackToInputBtn();
  }

  if (view === 'chart') {
    model.createChartDataObject();
    calcViewChart.render(model.state);
  }

  if (view === 'table') calcViewTable.render(model.state);
};

const controlForm = async function (formData) {
  try {
    calcViewNav.hide();
    if (!model.state.mobile)
      calcViewButtonSpinnerError.render('spinner', 'summary');
    if (model.state.mobile)
      calcViewButtonSpinnerError.render('spinner', 'form');

    model.validateUserInput(formData);

    model.createUserInputObject(formData);

    await model.loadAPIData();

    calcViewSummary.render(model.state);
    if (model.state.mobile) renderBackToInputBtn();

    calcViewNav.render(model.state.mobile);
    calcViewNav.addHandlerCalcNav(controlCalcView);
  } catch (err) {
    console.error(`--------------${err}--------------`);
    // if (!model.state.mobile) calcViewSummary.render(model.state);
    if (!model.state.mobile)
      calcViewButtonSpinnerError.render(err.message, 'summary');
    if (model.state.mobile)
      calcViewButtonSpinnerError.render(err.message, 'form');
    calcViewButtonSpinnerError.addHandlerMobileBackToInput(
      controlMobileBackToInput
    );
  }
};

const controlOldestDate = function (selectedCrypto) {
  model.updateSelectedCrypto(selectedCrypto);
  calcViewInput.updateOldestDate(
    model.state.oldestDateAvailable,
    selectedCrypto
  );
};

const controlMainElementResize = function (calcWidth) {
  model.updateMobileView(calcWidth);
  if (model.state.mobile !== model.state.mobilePrevious) {
    controlCalcView(model.state.calcView);
    calcViewNav.render(model.state.mobile);
  }
  // calcViewInputRenderAndAddHandlers();
  // Render summary only when form was already submitted at least once
  // (won't get rendered if there's no input page due to guard clause in render method)
  // if (model.state.formSubmitted) calcViewSummary.render(model.state);

  // if (model.state.mobile) renderBackToInputBtn();
};

const controlMobileBackToInput = function () {
  calcViewInputRenderAndAddHandlers();
  if (model.state.mobile) {
    calcViewInputInvesting.update(model.state.userInput.investing);
    calcViewInputDate.update(model.state.userInput.startingDate);
    controlInvestingAmount(model.state.userInput.investing.toString());
    controlInvestingDate(model.state.userInput.startingDate);
  }
};

const controlInvestingAmount = function (input) {
  calcViewInputInvesting.renderInputError(model.isInvestingInputCorrect(input));
};

const controlInvestingDate = function (input) {
  calcViewInputDate.renderInputError(model.isDateInputCorrect(input));
};

///////////////////////////////////////////////////////////
// HELPERS
const calcViewInputRenderAndAddHandlers = function () {
  calcViewInput.render(model.state);
  calcViewInput.addHandlerUpdateOldestDate(controlOldestDate);
  calcViewInputInvesting.addHandlerInputInvesting(controlInvestingAmount);
  calcViewInputDate.addHandlerInputDate(controlInvestingDate);
};

const renderBackToInputBtn = function () {
  calcViewButtonSpinnerError.render('button', 'summary');
  calcViewButtonSpinnerError.addHandlerMobileBackToInput(
    controlMobileBackToInput
  );
};

///////////////////////////////////////////////////////////
// INIT
const init = function () {
  mainView.addHandlerMainContainer(controlMain);
  mainView.addHandlerMainElementResize(controlMainElementResize);
};
init();
