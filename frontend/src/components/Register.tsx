import { useState } from 'react';
import '../styles/Register.css';


export function Register(): JSX.Element {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');


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
            </div>
        </div>
    )
}