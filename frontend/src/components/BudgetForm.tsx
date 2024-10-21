import { useState } from 'react';
import '../styles/BudgetForm.css';

export function BudgetForm(): JSX.Element {
    const [category, setCategory] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);

    return(
        <div className="budget-form-container">
            <input type="text" className="budget-input" placeholder="Category" onChange={(event)=>setCategory(event.target.value)}></input>
            <input type="text" className="budget-input" placeholder="Amount" onChange={(event)=>setAmount(Number(event.target.value))}></input>
            <button className='budget-button'>Add</button>
        </div>
    )
}