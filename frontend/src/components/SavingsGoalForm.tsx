import { useState } from 'react';
import '../styles/SavingsGoalForm.css';

export function SavingsGoalForm(): JSX.Element {

    const [category, setCategory] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    
    return(
        <div className="savings-goal-form-container" data-testid='savings-goal-form'>
            <input type="text" className="savings-goal-input" placeholder="Category" onChange={(event)=>setCategory(event.target.value)}></input>
            <input type="text" className="savings-goal-input" placeholder="Amount" onChange={(event)=>setAmount(Number(event.target.value))}></input>
            <button className='savings-goal-button'>Create</button>
        </div>
    )
}