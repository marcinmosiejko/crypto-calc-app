import calcView from './calcView';

class CalcViewTable extends calcView {
  _generateMarkup() {
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
                    <tr>
                        <td class="date">29.06.2015</td>
                        <td class="invested">
                            100.00<span class="symbol">$</span>
                    </td>
                    <td class="value">100.00<span class="symbol">$</span></td>
                    </tr>
                    <tr>
                    <td class="date">29.07.2015</td>
                    <td class="invested">
                        200.00<span class="symbol">$</span>
                    </td>
                    <td class="value">300.00<span class="symbol">$</span></td>
                    </tr>
                    <tr>
                    <td class="date">29.08.2015</td>
                    <td class="invested">
                        300.00<span class="symbol">$</span>
                    </td>
                    <td class="value">500.00<span class="symbol">$</span></td>
                    </tr>
                    <tr>
                    <td class="date">29.09.2015</td>
                    <td class="invested">
                        400.00<span class="symbol">$</span>
                    </td>
                    <td class="value">400.00<span class="symbol">$</span></td>
                    </tr>
                    <tr>
                    <td class="date">29.10.2015</td>
                    <td class="invested">
                        500.00<span class="symbol">$</span>
                    </td>
                    <td class="value">700.00<span class="symbol">$</span></td>
                    </tr>
                    <tr>
                    <td class="date">29.11.2015</td>
                    <td class="invested">
                        600.00<span class="symbol">$</span>
                    </td>
                    <td class="value">900.00<span class="symbol">$</span></td>
                    </tr>
                    <tr>
                    <td class="date">29.12.2015</td>
                    <td class="invested">
                        700.00<span class="symbol">$</span>
                    </td>
                    <td class="value">1200.00<span class="symbol">$</span></td>
                    </tr>

                    <tr>
                    <td class="date">29.01.2016</td>
                    <td class="invested">
                        800.00<span class="symbol">$</span>
                    </td>
                    <td class="value">1900.00<span class="symbol">$</span></td>
                    </tr>
                    <tr>
                    <td class="date">29.02.2016</td>
                    <td class="invested">
                        900.00<span class="symbol">$</span>
                    </td>
                    <td class="value">1500.00<span class="symbol">$</span></td>
                    </tr>
                    <tr>
                    <td class="date">29.03.2016</td>
                    <td class="invested">
                        1000.00<span class="symbol">$</span>
                    </td>
                    <td class="value">2900.00<span class="symbol">$</span></td>
                    </tr>
                    <tr>
                    <td class="date">29.03.2016</td>
                    <td class="invested">
                        1000.00<span class="symbol">$</span>
                    </td>
                    <td class="value">2900.00<span class="symbol">$</span></td>
                    </tr>
                    <tr>
                    <td class="date">29.03.2016</td>
                    <td class="invested">
                        1000.00<span class="symbol">$</span>
                    </td>
                    <td class="value">2900.00<span class="symbol">$</span></td>
                    </tr>
                </tbody>
                </table>
            </div>
            
            `;
  }
}

export default new CalcViewTable();
