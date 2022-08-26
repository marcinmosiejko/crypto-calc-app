import calcView from './calcView';

class CalcViewTable extends calcView {
  _generateMarkup() {
    const data = this._data.dataPointsInvestedSummary;

    // When form wasn't yet submitted and there's no summary data to display in the table
    if (!data) return '';

    return `
            <div class="table-view">
                <table class="table">
                    <thead class="table-head">
                        <tr>
                        <td class="date">date</td>
                        <td class="invested">invested</td>
                        <td class="value">value</td>
                        </tr>
                    </thead>
                    <tbody class="table-body">
                    ${data
                      .map(dataPoint => {
                        return `
                            <tr>
                                <td class="date">
                                    ${dataPoint.date}
                                </td>
                                <td class="invested">
                                    ${dataPoint.investedAccumulated}
                                    <span class="symbol">$</span>
                                </td>
                                <td class="value">
                                    ${dataPoint.cryptoValue.toFixed(0)}
                                    <span class="symbol">$</span>
                                </td>
                            </tr>
                            `;
                      })
                      .join('')}
                    </tbody>
                </table>
            </div>
            `;
  }
}

export default new CalcViewTable();
