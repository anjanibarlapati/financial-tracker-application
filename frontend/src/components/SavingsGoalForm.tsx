import { useContext, useState } from 'react';
import '../styles/SavingsGoalForm.css';
import { UserContext } from '../contexts/user';
import { addSavingsGoal } from '../services/user';

export function SavingsGoalForm(): JSX.Element {

    const [category, setCategory] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const { setCurrentUser } = useContext(UserContext);
    
    async function createSavingsGoal() {

        try {
            if (!category || !amount) {
                alert("Please fill in all fields.");
                return;
            }
            const user = await addSavingsGoal({title:category, targetAmount:amount, currentAmountSaved:0});
            setCurrentUser(user);
            alert("Savings goal added successfully");
        } catch (error) {
            alert("Adding savings goal failed");
        }

    }
    
    return(
        <div className="savings-goal-form-container" data-testid='savings-goal-form'>
            <input type="text" className="savings-goal-input" placeholder="Category" onChange={(event)=>setCategory(event.target.value)}></input>
            <input type="text" className="savings-goal-input" placeholder="Amount" onChange={(event)=>setAmount(Number(event.target.value))}></input>
            <button className='savings-goal-button' onClick={async () => await createSavingsGoal()}>Create</button>
        </div>
    )
}