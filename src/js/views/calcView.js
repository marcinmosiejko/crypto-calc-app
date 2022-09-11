import View from './View.js';
import { INVESTING_LIMIT_TOP, INVESTING_LIMIT_BOTTOM } from '../config.js';

import Chart from 'chart.js/auto';

class CalcView extends View {
  _data;
  _parentElement;

  render(data) {
    this._data = data;
    const { calcView } = this._data;

    this._parentElement = document.querySelector('.calc');

    // If there's no calc element (other page then calc clicked), do NOT render
    if (!this._parentElement) return;

    if (calcView === 'input' || calcView === 'summary') {
      this._renderBasic(this._generateInputMarkup.bind(this));
    }

    if (calcView === 'chart') {
      // Render canvas for the chart
      this._renderBasic(this._generateCanvasMarkup.bind(this));
      // Render chart
      this._renderChart();
    }

    if (calcView === 'table')
      this._renderBasic(this._generateTableMarkup.bind(this));
  }

  _renderChart() {
    const canvas = document.querySelector('.chart');
    const config = this._generateChartConfig();
    const chart = new Chart(canvas, config);
  }

  _generateCanvasMarkup() {
    return `
            <div class="chart-view">
            <canvas class="chart"></canvas>
            </div>
            `;
  }

  _generateInputMarkup() {
    const { userInput, summary, oldestDateAvailable, userLocale, mobile } =
      this._data;

    return `
            <div class="input-summary-view">
                <form class="form">
                <div class="input-amount">
                    <label for="investing">
                    <span>If I invested USD</span>
                    <span class="available">
                        between ${INVESTING_LIMIT_BOTTOM} and ${INVESTING_LIMIT_TOP}
                    </span>
                    
                    </label>
                    <input
                    id="investing"
                    type="number"
                    placeholder="$"
                    name="investing"
                    value="${userInput.investing}"
                    required
                    />
                </div>

                <div class="input-btn input-btn--crypto">
                    <p class="label-btn">into</p>
                    <div class="flex-btn">
                    <label for="btc">
                        <input
                        id="btc"
                        type="radio"
                        value="bitcoin"
                        name="crypto"
                        required
                        ${userInput.crypto === 'bitcoin' ? 'checked' : ''}
                        /><span>BTC</span></label
                    >

                    <label for="eth">
                        <input
                        id="eth"
                        type="radio"
                        value="ethereum"
                        name="crypto"
                        ${userInput.crypto === 'ethereum' ? 'checked' : ''}
                        /><span>ETH</span></label
                    >

                    <label for="bnb">
                        <input
                        id="bnb"
                        type="radio"
                        value="binancecoin"
                        name="crypto"
                        ${userInput.crypto === 'binancecoin' ? 'checked' : ''}
                        /><span>BNB</span>
                    </label>

                    <label for="sol">
                        <input
                        id="sol"
                        type="radio"
                        value="solana"
                        name="crypto"
                        ${userInput.crypto === 'solana' ? 'checked' : ''}
                        /><span>SOL</span></label
                    >
                    </div>
                </div>

                <div class="input-btn input-btn--interval">
                    <p class="label-btn">every</p>
                    <div class="flex-btn">
                    <label for="month">
                        <input
                        id="month"
                        type="radio"
                        value="1m"
                        name="interval"
                        required
                        ${userInput.interval === '1m' ? 'checked' : ''}
                        /><span>month</span>
                    </label>

                    <label for="2 weeks">
                        <input
                        id="2 weeks"
                        type="radio"
                        value="2w"
                        name="interval"
                        ${userInput.interval === '2w' ? 'checked' : ''}
                        /><span>2 weeks</span></label
                    >

                    <label for="week">
                        <input
                        id="week"
                        type="radio"
                        value="1w"
                        name="interval"
                        ${userInput.interval === '1w' ? 'checked' : ''}
                        /><span>week</span></label
                    >
                    </div>
                </div>

                <div class="input-date">
                    <label for="date">
                        <span>starting from</span>
                        <span class="available">
                            oldest available: 
                            <span class="oldest-date">${this._formatDate(
                              Date.parse(oldestDateAvailable[userInput.crypto]),
                              userLocale
                            )}</span>
                        </span>
                    </label
                    >
                    <input
                    id="date"
                    type="date"
                    name="startingDate"
                    placeholder="28.04.2013"
                    value="${userInput.startingDate}"
                    required
                    />
                </div>
                <div class="form-button-spinner-error">
                <button type="submit" value="submit" class="btn btn--form">
                    CALC
                </button>
                </div>
                
                </form>
                
                ${
                  !mobile
                    ? `
                <div class="summary">
                    <div class="summary-main">
                        <div class="value">
                            <span class="summary-description">
                                value
                            </span>
                            <span class="summary-number">
                                0
                                <span class="symbol">$</span>
                            </span>
                        </div>
                        <div class="invested">
                            <span class="summary-description">
                                invested
                            </span>
                            <span class="summary-number">
                                0
                                <span class="symbol">$</span>
                            </span>
                        </div>
                        <div class="roi">
                            <span class="summary-description">
                                ROI
                            </span>
                            <span class="summary-number">
                                0
                                <span class="symbol">%</span>
                            <span>
                        </div>
                    </div>
                    <div class="summary-additional">
                        <div class="crypto">
                            <span class="summary-description">
                                crypto amount
                            </span>
                            <span class="summary-number">
                            0
                            </span>
                        </div>
                        <div class="investments">
                            <span class="summary-description">
                                investments
                            </span>
                            <span class="summary-number">
                            0
                            </span>
                        </div>
                    </div>
                    <div class="summary-button-spinner-error">
                    </div>
                </div>
                `
                    : ``
                }
          `;
  }

  _generateChartConfig() {
    const { chartData, mobile } = this._data;
    Chart.defaults.font.family = `'Rubik', sans-serif`;
    Chart.defaults.color = `#343a40`;

    // To set larger space between chart legend and chart itself
    const legendMargin = {
      id: `legendMargin`,
      beforeInit(chart, legend, options) {
        // Get reference to the original fit function
        const originalFit = chart.legend.fit;

        // Override the fit function
        chart.legend.fit = function fit() {
          // Call original function and bind scope in order to use `this` correctly inside it
          originalFit.bind(chart.legend)();
          // Change the height as suggested in another answers
          this.height += 32;
        };
      },
    };

    const config = {
      type: 'line',
      data: chartData,
      plugins: [legendMargin],
      options: {
        aspectRatio: mobile ? 1 : 1.9,
        plugins: {
          legendMargin,
          legend: {
            display: true,
            labels: {
              font: {
                size: mobile ? 14 : 16,
                weight: 500,
              },
              boxWidth: 32,
            },
          },
        },
        scales: {
          y: {
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, ticks) {
                return `${value} $`;
              },
            },
          },
        },
      },
    };

    return config;
  }

  _generateTableMarkup() {
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

export default new CalcView();
