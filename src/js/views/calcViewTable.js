import calcView from './calcView';

class CalcViewTable extends calcView {
  _generateMarkup() {
    const {
      userLocale,
      mobile,
      summary: { totalCryptoAmount, dataPointsInvestedSummary: data },
      APIdata: { currentPrice },
    } = this._data;

    const dayFormat = mobile ? false : '2-digit';
    // When form wasn't yet submitted and there's no summary data to display in the table
    if (!data) return '';

    return `
        <div class="table-container">    
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
                    <div class="table-body-container">
                        ${data
                          .map(dataPoint => {
                            return `
                                <tr>
                                    <td class="date">
                                        ${this._formatDate(
                                          Date.parse(dataPoint.date),
                                          userLocale,
                                          dayFormat
                                        )}
                                    </td>
                                    <td class="invested">
                                        ${this._formatNumber(
                                          dataPoint.investedAccumulated,
                                          userLocale
                                        )}
                                        <span class="symbol">$</span>
                                    </td>
                                    <td class="value">
                                        ${this._formatNumber(
                                          Math.round(dataPoint.cryptoValue),
                                          userLocale
                                        )}
                                        <span class="symbol">$</span>
                                    </td>
                                </tr>
                                `;
                          })
                          .join('')}
                        <tr>
                            <td class="date">
                                ${
                                  mobile
                                    ? 'today'
                                    : this._formatDate(
                                        Date.today(),
                                        userLocale,
                                        dayFormat
                                      )
                                }
                            </td>
                            <td class="invested">
                                ${this._formatNumber(
                                  data.at(-1).investedAccumulated,
                                  userLocale
                                )}
                                <span class="symbol">$</span>
                            </td>
                            <td class="value">
                                ${this._formatNumber(
                                  Math.round(totalCryptoAmount * currentPrice),
                                  userLocale
                                )}
                                <span class="symbol">$</span>
                            </td>
                        </tr>
                    </tbody>
                    </div>
                </table>
            </div>
        </div>
            `;
  }
}

export default new CalcViewTable();
