import { useContext, useState } from 'react';
import '../styles/BudgetForm.css';
import { addBudget } from '../services/user';
import { UserContext } from '../contexts/user';

export function BudgetForm(): JSX.Element {
    const [category, setCategory] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const { setCurrentUser } = useContext(UserContext);


    async function createBudgetHandler() {

        try {
            if (!category || !amount) {
                alert("Please fill in all fields.");
                return;
            }
            const user = await addBudget(category, amount);
            setCurrentUser(user);
            alert("Budget added successfully");
        } catch (error) {
            alert("Adding budget failed");
        }

    }

    return (
        <div className="budget-form-container" data-testid="budget-form">
            <input type="text" className="budget-input" placeholder="Category" onChange={(event) => setCategory(event.target.value)}></input>
            <input type="text" className="budget-input" placeholder="Amount" onChange={(event) => setAmount(Number(event.target.value))}></input>
            <button className='budget-button' onClick={async () => await createBudgetHandler()}>Create</button>
        </div>
    )
}