import { useState } from 'react';
import '../styles/Login.css';

export function Login(): JSX.Element {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

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
                <button type="submit" className='login-button'>Login</button>
            </div>
        </div>
    )
}