import { useState } from "react";
import '../styles/RecordExpenses.css';
import { TransactionForm } from "./TransactionForm";
import { BudgetForm } from "./BudgetForm";
import { SavingsGoalForm } from "./SavingsGoalForm";

export function RecordExpenses(): JSX.Element {

    const [transactionFormFlag, setTransactionFormFlag] = useState<boolean>(false);
    const [budgetFormFlag, setBudgetFormFlag] = useState<boolean>(false);
    const [savingsGoalFormFlag, setSavingsGoalFormFlag] = useState<boolean>(false);

    function transactionHandler() {
        setTransactionFormFlag(true);
        setBudgetFormFlag(false);
        setSavingsGoalFormFlag(false);
    }

    function budgetHandler() {
        setBudgetFormFlag(true);
        setTransactionFormFlag(false);
        setSavingsGoalFormFlag(false);
    }

    function savingsGoalsHandler() {
        setSavingsGoalFormFlag(true);
        setBudgetFormFlag(false);
        setTransactionFormFlag(false);
    }

    return (
        <div className="record-expenses-container">
            <h1 className="record-expenses-title">Record Expenses</h1>
            <div className="record-expenses-icons">
                <div className="icon-container">
                    <div className="icon-body" onClick={() => transactionHandler()}>
                        <img src={'/assets/transaction.png'} alt="transaction" className="record-expenses-icon"></img>
                        <h3 className="icon-title">Add Transaction</h3>
                    </div>
                    <div>
                        {transactionFormFlag && <TransactionForm />}
                    </div>
                </div>
                <div className="icon-container">
                    <div className="icon-body" onClick={() => budgetHandler()}>
                        <img src={'/assets/budget.png'} alt="budget" className="record-expenses-icon"></img>
                        <h3 className="icon-title">Create Budget</h3>
                    </div>
                    <div>
                        {budgetFormFlag && <BudgetForm />}
                    </div>
                </div>
                <div className="icon-container">
                    <div className="icon-body" onClick={() => savingsGoalsHandler()}>
                        <img src={'/assets/savings-goals.png'} alt="savings-goals" className="record-expenses-icon"></img>
                        <h3 className="icon-title">Create Savings Goal</h3>
                    </div>
                    <div>
                        {savingsGoalFormFlag && <SavingsGoalForm />}
                    </div>
                </div>
            </div>
        </div>
    )
}
