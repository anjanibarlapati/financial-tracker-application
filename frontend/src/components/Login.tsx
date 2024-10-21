import {  useState } from 'react';
import '../styles/Login.css';
import { loginUser } from '../services/user';
import { useNavigate } from 'react-router-dom';

export function Login(): JSX.Element {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    async function loginHandler() {
        try {
            const user = await loginUser(username, password);
            navigate("/homepage")
        } catch (error: any) {
            alert(`User login failed :(`)
        }
    }

    return (
        <div className="container">
            <div className='title-logo'>
                <p className='app-title'>FinGrow</p>
                <img src="/assets/app-logo.png" className='app-logo' alt='Logo'></img>
            </div>
            <p className='title'>Welcome back to FinGrow!!</p>
            <div className='login-form'>
                <input type="text" className="input" placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)} />
                <input type="password" className="input" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className='login-button' onClick={async () => await loginHandler()}>Login</button>
            </div>
            <p className='register-body'>Do not have an account?<span className='register-link' onClick={()=>navigate("/register")}>Register</span> </p>
        </div>
    )
}