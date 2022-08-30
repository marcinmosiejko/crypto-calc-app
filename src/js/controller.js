import * as model from './model.js';
import mainView from './views/mainView.js';
// import calcView from './views/calcView.js';
import calcViewInput from './views/calcViewInput.js';
import calcViewChart from './views/calcViewChart.js';
import calcViewTable from './views/calcViewTable.js';
import calcViewInputSummary from './views/calcViewInputSummary.js';

const controlMain = function () {
  mainView.render();
  calcViewInput.render(model.state);
  //  Render summary only when form was already submitted at least once
  if (model.state.formSubmitted) calcViewInputSummary.render(model.state);

  calcViewInput.addHandlerCalcNav(controlCalcView);
  calcViewInput.addHandlerForm(controlForm);
  calcViewInput.addHandlerUpdateOldestDate(controlOldestDate);
};

const controlCalcView = function (view) {
  if (view === 'input') {
    calcViewInput.render(model.state);
    // Render summary only when form was already submitted at least once
    if (model.state.formSubmitted) calcViewInputSummary.render(model.state);
  }

  if (view === 'chart') calcViewChart.render(model.state.summary);
  if (view === 'table') calcViewTable.render(model.state.summary);
};

const controlForm = async function (formData) {
  try {
    if (!model.validateUserInput(formData))
      throw new Error('Incorrect input ;(');

    model.createUserInputObject(formData);

    await model.loadAPIData();

    // calcViewInput.render(model.state);
    calcViewInputSummary.render(model.state);
  } catch (err) {
    console.error(`--------------${err}`);
  }
};

controlOldestDate = function (selectedCrypto) {
  calcViewInput.updateOldestDate(
    model.state.oldestDataAvailable,
    selectedCrypto
  );
};

const init = function () {
  mainView.addHandlerMainContainer(controlMain);
};
init();
