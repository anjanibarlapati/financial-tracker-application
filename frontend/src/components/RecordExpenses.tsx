import '../styles/RecordExpenses.css';

export function RecordExpenses(): JSX.Element {

    return (
        <div className="record-expenses-container">
            <h1 className="record-expenses-title">Record Expenses</h1>
            <div className="record-expenses-icons">
                <div className="icon-container">
                    <div className="icon-body">
                        <img src={'/assets/transaction.png'} alt="transaction" className="record-expenses-icon"></img>
                        <h3 className="icon-title">Add Transaction</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}
