import * as model from './model.js';
import mainView from './views/mainView.js';
import calcViewForm from './views/calcViewForm.js';
import calcViewInputInvesting from './views/calcViewInputInvesting.js';
import calcViewInputDate from './views/calcViewInputDate.js';
import calcViewSummary from './views/calcViewSummary.js';
import calcView from './views/calcView.js';
import calcViewNav from './views/calcViewNav.js';
import calcViewButtonSpinnerError from './views/calcViewButtonSpinnerError.js';

const controlMain = function () {
  mainView.render();
  calcViewInputRenderAndAddHandlers();

  // Form handler only in controlMain as it's attached to the .calc element that doesn't get rerendered in other controllers
  calcViewForm.addHandlerForm(controlForm);
  //  Render summary and calc nav only when form was already submitted and data successfuly fetched at least once
  if (model.state.formSubmitted) {
    if (!model.state.mobile) calcViewSummary.render(model.state);
    if (model.state.mobile) renderBackToInputBtn();

    calcViewNav.render(model.state);
    calcViewNav.addHandlerCalcNav(controlCalcView);
  }

  // Check user input fields and render if wrong input
  renderUserInputError();
};

const controlCalcView = function (view) {
  model.updateCalcView(view);
  calcViewInputRenderAndAddHandlers();
  // Render summary only when form was already submitted at least once
  // (won't get rendered if there's no input page due to guard clause in render method)
  if (model.state.formSubmitted) calcViewSummary.render(model.state);
  // Render back-to-input button only when on mobile
  if (model.state.mobile) renderBackToInputBtn();
};

const controlForm = async function (formData) {
  try {
    calcViewNav.hide();

    calcViewButtonSpinnerError.renderSpinner(model.state.mobile);

    model.validateUserInput(formData);

    model.createUserInputObject(formData);

    await model.loadAPIData();

    calcViewSummary.render(model.state);

    if (model.state.mobile) renderBackToInputBtn();

    calcViewNav.render(model.state);

    // We want to add only one handler, so we do it at first succesful form submit and data fetch, then we update formSubmitted to true, which will prohibit from adding mobultiple handlers every time form is succesfully submitted and data fetched
    if (!model.state.formSubmitted)
      calcViewNav.addHandlerCalcNav(controlCalcView);
    model.updateFormSubmitted();
  } catch (err) {
    console.error(`-------------- ${err} --------------`);

    calcViewButtonSpinnerError.renderError(model.state.mobile, err.message);
    calcViewButtonSpinnerError.addHandlerMobileBackToInput(
      controlMobileBackToInput
    );
  }
};

const controlOldestDate = function (selectedCrypto) {
  model.updateSelectedCrypto(selectedCrypto);
  calcViewForm.updateOldestDate(model.state);
  controlInvestingDate(model.state.userInput.startingDate);
};

const controlMainElementResize = function (calcWidth) {
  model.updateMobileView(calcWidth);
  if (model.state.mobile !== model.state.mobilePrevious) {
    controlCalcView(model.state.calcView);

    if (model.state.formSubmitted) calcViewNav.render(model.state);

    // Check user input fields and render if wrong input
    renderUserInputError();
  }
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
  calcView.render(model.state);
  calcViewForm.addHandlerUpdateOldestDate(controlOldestDate);
  calcViewInputInvesting.addHandlerInputInvesting(controlInvestingAmount);
  calcViewInputDate.addHandlerInputDate(controlInvestingDate);
};

const renderBackToInputBtn = function () {
  calcViewButtonSpinnerError.renderButton(model.state.mobile);
  calcViewButtonSpinnerError.addHandlerMobileBackToInput(
    controlMobileBackToInput
  );
};

const renderUserInputError = function () {
  calcViewInputInvesting.renderInputError(
    model.isInvestingInputCorrect(model.state.userInput.investing.toString())
  );
  calcViewInputDate.renderInputError(
    model.isDateInputCorrect(model.state.userInput.startingDate)
  );
};

///////////////////////////////////////////////////////////
// INIT
const init = function () {
  mainView.addHandlerMainContainer(controlMain);
  mainView.addHandlerMainElementResize(controlMainElementResize);
};
init();
