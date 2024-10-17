import '../styles/Register.css';

export function Register(): JSX.Element {
    return (
        <div className="container">
            <p className='app-title'>FinGrow</p>
            <img src="/assets/app-logo.png" className='app-logo' alt='Logo'></img>
            <form className='register-form'>
                <input type="text" className="username" placeholder="Enter Username"/>
            </form>
        </div>
    )
}