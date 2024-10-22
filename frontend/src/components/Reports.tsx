import { useState } from 'react';
import '../styles/Reports.css';
import { generateBudgetSummary, generateSavingsGoalsProgressReport, generateTotalIncomeAndExpenses } from '../services/user';
import { IFinancialReport, IFinancialReportBudget, IFinancialReportSavingsGoal } from '../interfaces/financialReport';

export function Reports(): JSX.Element {

    const [option, setOption] = useState<string>('');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');

    const [isReportGenereationToggled, setIsReportGenereationToggled] = useState<boolean>(false);
    const [incomeExpensesReport, setIncomeExpensesReport] = useState<IFinancialReport>({ totalExpenses: 0, totalIncome: 0 });
    const [budgetSummaryReport, setBudgetSummaryReport] = useState<IFinancialReportBudget[]>([]);
    const [savingsGoalsProgressReport, setSavingsGoalsProgressReport] = useState<IFinancialReportSavingsGoal[]>([]);


    async function generateReportHandler() {
        try {
            if (!fromDate || !toDate || !option) {
                alert("Please fill in all fields.");
                return;
            }

            if (isNaN(Date.parse(fromDate)) || isNaN(Date.parse(toDate))) {
                alert("Please enter valid dates.");
                return;
            }
            if (fromDate > toDate) {
                alert("From date must be earlier than To date.");
                return;
            }
            setIsReportGenereationToggled(true);

            if (option === 'Total expenses and income') {
                const report: IFinancialReport = await generateTotalIncomeAndExpenses(new Date(fromDate), new Date(toDate));
                setIncomeExpensesReport(report);
            }

            if (option === 'Budget Summary') {
                const report: IFinancialReportBudget[] = await generateBudgetSummary(new Date(fromDate), new Date(toDate));
                setBudgetSummaryReport(report);
            }

            if (option === 'Savings goals progress') {
                const report: IFinancialReportSavingsGoal[] = await generateSavingsGoalsProgressReport(new Date(fromDate), new Date(toDate));
                setSavingsGoalsProgressReport(report);
            }
        }
        catch (error) {
            alert("Failed to generate report");
        }
    }

    return (
        <div className='reports-container'>
            <div className="reports-header-container">
                <div className="reports-header">
                    <img src={'/assets/report.png'} alt="report" className="reports-icon"></img>
                    <h3 className="reports-title">Generate Reports</h3>
                </div>
            </div>
            <div className='report-dropdown'>
                <div className='report-dropdown-body'>
                    <select name='reports' className='reports-options' value={option} onChange={(event) => {setOption(event.target.value); setIsReportGenereationToggled(false)}}>
                        <option value='' disabled>Select your option</option>
                        <option value="Total expenses and income">Total expenses and income</option>
                        <option value="Budget Summary">Budget Summary</option>
                        <option value="Savings goals progress">Savings goals progress</option>
                    </select>
                    <input type="text" placeholder='From Date YYYY-MM-DD' className='reports-input' onChange={(event) => setFromDate(event.target.value)} />
                    <input type="text" placeholder='To Date YYYY-MM-DD' className='reports-input' onChange={(event) => setToDate(event.target.value)} />
                    <button className='generate' onClick={async () => await generateReportHandler()}>Generate</button>
                </div>
            </div>
            {
                isReportGenereationToggled && option === 'Total expenses and income' &&
                <div className='report-dropdown'>
                    <div className='report-body'>
                        <h3 className='report-title'>Total income and expenses over given specific period</h3>
                        <div className='report-element-body'>
                            <p className='report-element'>Total Income</p>
                            <p className='report-element-amount'>{incomeExpensesReport.totalIncome}</p>
                        </div>
                        <div className='report-element-body'>
                            <p className='report-element'>Total Expenses</p>
                            <p className='report-element-amount'>{incomeExpensesReport.totalExpenses}</p>
                        </div>
                    </div>
                </div>
            }

            {
                isReportGenereationToggled && option === 'Budget Summary' &&
                <div className='report-dropdown'>
                    {budgetSummaryReport.length === 0 ?
                        (
                            <div className='report-body'>
                                <h3 className='report-title'>Budget summary over given specific period</h3>
                                <p className='empty-report'>You have no budgets :(</p>
                            </div>
                        ) :
                        (
                            <div className='report-body'>
                                <h3 className='report-title'>Budget summary over given specific period</h3>
                                <div className='report-element-body'>
                                    <p className='report-element-title'>Category</p>
                                    <p className='report-element-title'>Amount</p>
                                    <p className='report-element-title'>Amount Spent</p>
                                </div>
                                {budgetSummaryReport.map((budget, index) => {
                                    return (
                                        <div key={index} className='report-element-body'>
                                            <p className='report-element'>{budget.category}</p>
                                            <p className='report-element'>{budget.amount}</p>
                                            <p className='report-element-amount'>{budget.amountSpent}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                </div>
            }

            {
                isReportGenereationToggled && option === 'Savings goals progress' &&
                <div className='report-dropdown'>
                    {savingsGoalsProgressReport.length === 0 ?
                        (
                            <div className='report-body'>
                                <h3 className='report-title'>Savings goals progress over given specific period</h3>
                                <p className='empty-report'>You have no savings goals :(</p>
                            </div>
                        ) :
                        (
                            <div className='report-body'>
                                <h3 className='report-title'>Savings Goals Progress over given specific period</h3>
                                <div className='report-element-body'>
                                    <p className='report-element-title'>Title</p>
                                    <p className='report-element-title'>Progress</p>
                                </div>
                                {savingsGoalsProgressReport.map((goal, index) => {
                                    return (
                                        <div key={index} className='report-element-body'>
                                            <p className='report-element'>{goal.title}</p>
                                            <p className='report-element-amount'>{goal.progress}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                </div>
            }
        </div>
    )
}