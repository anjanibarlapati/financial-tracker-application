import { useContext, useState } from 'react';
import '../styles/Register.css';
import { registerUser } from '../services/user';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/user';


export function Register(): JSX.Element {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {setCurrentUser} = useContext(UserContext);
    const navigate = useNavigate();

    async function registerHandler() {
        try {
            const user = await registerUser(username, password);
            setCurrentUser(user);
            navigate("/homepage");
        } catch (error: any) {
            alert(`Registering the user failed :(`)
        }
    }

    return (
        <div className="container">
            <div className='title-logo'>
                <p className='app-title'>FinGrow</p>
                <img src="/assets/app-logo.png" className='app-logo' alt='Logo'></img>
            </div>
            <p className='title'>Join FinGrow Now!!</p>
            <div className='register-form'>
                <input type="text" className="input" placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)} />
                <input type="password" className="input" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className='register' onClick={async () => await registerHandler()}>Register</button>
            </div>
            <p className='login-body'>Already have an account?<span className='login' onClick={() => navigate("/login")}>Login</span> </p>
        </div>
    )
}