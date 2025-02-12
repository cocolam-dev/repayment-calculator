import { useGlobalContext } from "./GlobalContext";
import { NumericFormat } from "react-number-format";

const RepaymentTable = () => {
  const {
    loanDetails,
    repayments,
    setRepayments,
    totalPrincipalRepaid,
    setTotalPrincipalRepaid,
    totalInterestPaid,
    setTotalInterstPaid,
  } = useGlobalContext();

  const handleChange = (e, id) => {
    const newRate = e.target.value;
    const newLoanAmount = repayments[id - 1].ClBal;
    const newRemainingNumOfMth = repayments[id].RemainingNumOfMth;
    let InterestPaid = 0;
    let RepaymentAmt = 0;
    let calcRepaymentAmt = 0;
    let PrincipalRepaid = 0;
    let OpBal = 0;
    let ClBal = 0;
    let AccPrincipalRepaid = parseFloat(0);
    let AccInterestPaid = parseFloat(0);
    const newRepayments = repayments.map((repayment) => {
      if (repayment.id >= id) {
        if (newRate === "") {
          OpBal = repayments[id - 1].ClBal;
          InterestPaid = 0;
          RepaymentAmt = 0;
          PrincipalRepaid = 0;
          ClBal = OpBal;
          AccInterestPaid = repayments[id - 1].AccInterestPaid;
          AccPrincipalRepaid = repayments[id - 1].AccPrincipalRepaid;
        } else {
          OpBal = (
            parseFloat(loanDetails.LoanAmount) - parseFloat(AccPrincipalRepaid)
          ).toFixed(2);

          //calculate interest paid
          InterestPaid = (
            parseFloat(OpBal) *
            (parseFloat(newRate) / 100 / 365.25) *
            parseFloat(repayment.NumOfDays)
          ).toFixed(2);

          //calculate repayment amount
          calcRepaymentAmt = (
            (parseFloat(newLoanAmount) * (parseFloat(newRate) / 100 / 12)) /
            (1 -
              (1 + parseFloat(newRate) / 100 / 12) **
                -parseFloat(newRemainingNumOfMth))
          ).toFixed(2);

          if (repayment.RemainingNumOfMth === 1) {
            RepaymentAmt = (
              parseFloat(OpBal) + parseFloat(InterestPaid)
            ).toFixed(2);
          } else {
            RepaymentAmt = parseFloat(calcRepaymentAmt).toFixed(2);
          }

          //calculate principal repaid
          PrincipalRepaid = (
            parseFloat(RepaymentAmt) - parseFloat(InterestPaid)
          ).toFixed(2);

          // //calculate closing balance
          ClBal = (parseFloat(OpBal) - parseFloat(PrincipalRepaid)).toFixed(2);

          //calculate accumulated principal repaid
          AccPrincipalRepaid = (
            parseFloat(AccPrincipalRepaid) + parseFloat(PrincipalRepaid)
          ).toFixed(2);

          setTotalPrincipalRepaid(AccPrincipalRepaid);

          //calculate accumulated interest paid
          AccInterestPaid = (
            parseFloat(AccInterestPaid) + parseFloat(InterestPaid)
          ).toFixed(2);
          setTotalInterstPaid(AccInterestPaid);
        }

        return {
          ...repayment,
          InterestRate: newRate,
          OpBal,
          RepaymentAmt,
          PrincipalRepaid,
          InterestPaid,
          ClBal,
          AccPrincipalRepaid,
          AccInterestPaid,
        };
      } else {
        AccPrincipalRepaid = repayment.AccPrincipalRepaid;
        setTotalPrincipalRepaid(repayment.AccPrincipalRepaid);
        AccInterestPaid = repayment.AccInterestPaid;
        setTotalInterstPaid(repayment.AccInterestPaid);

        return repayment;
      }
    });
    setRepayments(newRepayments);
  };

  return (
    <>
      <div>
        <p className="Notes">
          Once calculated, interest rate may be changed in the table below.
        </p>
        <p className="Notes">
          New interest rate is applied to the month that has been changed, as
          well as all following months
        </p>
        <p className="Notes">
          This is an estimate only and does not constitute financial advice.
        </p>
        <table>
          <tbody>
            <tr className="StickyHeaderRow">
              <th className="HideInSmallWindow">Remaining number of months</th>
              <th>Year</th>
              <th>Month</th>
              <th className="HideInSmallWindow">Number of days</th>
              <th>Annual interest rate %</th>
              <th>Opening balance</th>
              <th>Repayment</th>
              <th>Principal repaid</th>
              <th>Interest paid</th>
              <th>Closing balance</th>
              <th>Accumulated principal repaid</th>
              <th>Accumulated interest paid</th>
            </tr>
            {repayments.map((repayment) => {
              return (
                <tr key={repayment.id}>
                  <td key="RemainingNumOfMth" className="HideInSmallWindow">
                    {repayment.RemainingNumOfMth}
                  </td>
                  <td key="Year">{repayment.Year}</td>
                  <td key="Month">{repayment.Month}</td>
                  <td key="NumOfDays" className="HideInSmallWindow">
                    {repayment.NumOfDays}
                  </td>
                  <td key="InterestRate">
                    <input
                      className="RateChangeInput"
                      id="InterestRate"
                      value={repayment.InterestRate}
                      onChange={(e) => handleChange(e, repayment.id)}
                    ></input>
                  </td>
                  <td key="OpBal">
                    <NumericFormat
                      value={repayment.OpBal}
                      displayType="text"
                      thousandSeparator=","
                    />
                  </td>
                  <td key="RepaymentAmt">
                    <NumericFormat
                      value={repayment.RepaymentAmt}
                      displayType="text"
                      thousandSeparator=","
                    />
                  </td>
                  <td key="PrincipalRepaid">
                    <NumericFormat
                      value={repayment.PrincipalRepaid}
                      displayType="text"
                      thousandSeparator=","
                    />
                  </td>
                  <td key="InterestPaid">
                    <NumericFormat
                      value={repayment.InterestPaid}
                      displayType="text"
                      thousandSeparator=","
                    />
                  </td>
                  <td key="ClBal">
                    <NumericFormat
                      value={repayment.ClBal}
                      displayType="text"
                      thousandSeparator=","
                    />
                  </td>
                  <td key="AccPrincipalRepaid" className="AccRow">
                    <NumericFormat
                      value={repayment.AccPrincipalRepaid}
                      displayType="text"
                      thousandSeparator=","
                    />
                  </td>
                  <td key="AccInterestPaid" className="AccRow">
                    <NumericFormat
                      value={repayment.AccInterestPaid}
                      displayType="text"
                      thousandSeparator=","
                    />
                  </td>
                </tr>
              );
            })}
            <tr className="StickyFooterRow">
              <th className="HideInSmallWindow"></th>
              <th>{loanDetails.TermYear}</th>
              <th></th>
              <th className="HideInSmallWindow"></th>
              <th></th>
              <th></th>
              <th>
                <NumericFormat
                  value={(
                    parseFloat(totalPrincipalRepaid) +
                    parseFloat(totalInterestPaid)
                  ).toFixed(2)}
                  displayType="text"
                  thousandSeparator=","
                />
              </th>
              <th>
                <NumericFormat
                  value={parseFloat(totalPrincipalRepaid).toFixed(2)}
                  displayType="text"
                  thousandSeparator=","
                />
              </th>
              <th>
                <NumericFormat
                  value={parseFloat(totalInterestPaid).toFixed(2)}
                  displayType="text"
                  thousandSeparator=","
                />
              </th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
export default RepaymentTable;
