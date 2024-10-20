import '../styles/Register.css';


export function Register(): JSX.Element {

    return (
        <div className="container">
            <div className='title-logo'>
                <p className='app-title'>FinGrow</p>
                <img src="/assets/app-logo.png" className='app-logo' alt='Logo'></img>
            </div>
            <p className='title'>Join FinGrow Now!!</p>
            <div className='register-form'>
                <input type="text" className="input" placeholder="Enter Username" />
                <input type="password" className="input" placeholder="Enter Password"  />
            </div>
        </div>
    )
}