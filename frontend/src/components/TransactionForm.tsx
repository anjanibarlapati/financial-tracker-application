import { useState } from 'react';
import '../styles/TransactionForm.css';

export function TransactionForm(): JSX.Element {

    const [transactionType, setTransactionType] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [category, setCategory] = useState<string>('');
    const [date, setDate] = useState<string>('');

    return(
        <div className="transaction-form-container" data-testid='transaction-form'>
            <input type="text" className="transaction-input" placeholder="Transaction type" onChange={(event)=>setTransactionType(event.target.value)}></input>
            <input type="text" className="transaction-input" placeholder="Amount" onChange={(event)=>setAmount(Number(event.target.value))}></input>
            <input type="text" className="transaction-input" placeholder="Category" onChange={(event)=>setCategory(event.target.value)}></input>
            <input type="text" className="transaction-input" placeholder="YYYY-MM-DD" onChange={(event)=>setDate(event.target.value)}></input>
            <button className='transaction-button'>Add</button>
        </div>
    )
}