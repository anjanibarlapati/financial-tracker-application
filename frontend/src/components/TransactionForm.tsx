import { useContext, useState } from 'react';
import '../styles/TransactionForm.css';
import { ITransaction } from '../interfaces/transactions';
import { addTransaction } from '../services/user';
import { UserContext } from '../contexts/user';

export function TransactionForm(): JSX.Element {

    const [transactionType, setTransactionType] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [category, setCategory] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const { currentUser, setCurrentUser } = useContext(UserContext);

    async function addTransactionHandler() {
        try{
            if (!transactionType || !amount || !category || !date) {
                alert("Please fill in all fields.");
                return;
            }
            const budget = currentUser.budgets.find((budget) => budget.category === category);
            if (transactionType ==='debit' && budget && budget.amount - (budget.amountSpent + amount) < 0) {
                alert("Insufficient budget for given category");
                return;
            }

            const transaction: ITransaction = {id: currentUser.transactions.length + 1, type: transactionType.toLowerCase() as "debit" | "credit", amount: amount, category: category, date: new Date(date)} ;
            const user = await addTransaction(transaction);
            setCurrentUser(user);

            const goal = currentUser.savingsGoals.find(goal=>goal.title === category);
            if (transactionType ==='credit' && goal){
                const progress: number = Number((((goal.currentAmountSaved+amount) / goal.targetAmount) * 100).toFixed(0));    
                if (progress >= 90) {
                    alert (`You have reached ${progress}% of the target amount`);
                    return;
                }
            }
            alert("Transaction added successfully");
        } catch(error){
            alert("Unable to add transaction")
        }

    }

    return (
        <div className="transaction-form-container" data-testid='transaction-form'>
            <select name='transaction-type' className='transaction-types' value={transactionType} onChange={(event)=>setTransactionType(event.target.value)}>
                <option value='' disabled>Select transaction type</option>
                <option value= "credit">credit</option>
                <option value="debit">debit</option>
            </select>
            <input type="text" className="transaction-input" placeholder="Amount" onChange={(event) => setAmount(Number(event.target.value))}></input>
            <input type="text" className="transaction-input" placeholder="Category" onChange={(event) => setCategory(event.target.value)}></input>
            <input type="text" className="transaction-input" placeholder="YYYY-MM-DD" onChange={(event) => setDate(event.target.value)}></input>
            <button className='transaction-button' onClick={async () => await addTransactionHandler()}>Add</button>
        </div>
    )
}