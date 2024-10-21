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
    
            const transactionTypeLower = transactionType.toLowerCase();
            if (transactionTypeLower !== "debit" && transactionTypeLower !== "credit") {
                alert("Transaction type must be either 'debit' or 'credit'.");
                return;
            }
    
            const transaction: ITransaction = {id: currentUser.transactions.length + 1, type: transactionType.toLowerCase() as "debit" | "credit", amount: amount, category: category, date: new Date(date)} ;
            const user = await addTransaction(transaction);
            setCurrentUser(user);
            alert("Transaction added successfully");
        } catch(error){
            alert("Unable to add transaction")
        }

    }

    return (
        <div className="transaction-form-container" data-testid='transaction-form'>
            <input type="text" className="transaction-input" placeholder="Transaction type" onChange={(event) => setTransactionType(event.target.value)}></input>
            <input type="text" className="transaction-input" placeholder="Amount" onChange={(event) => setAmount(Number(event.target.value))}></input>
            <input type="text" className="transaction-input" placeholder="Category" onChange={(event) => setCategory(event.target.value)}></input>
            <input type="text" className="transaction-input" placeholder="YYYY-MM-DD" onChange={(event) => setDate(event.target.value)}></input>
            <button className='transaction-button' onClick={async () => await addTransactionHandler()}>Add</button>
        </div>
    )
}