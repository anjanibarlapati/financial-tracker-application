import '../styles/Login.css';


export function Login(): JSX.Element {

    return (
        <div className="container">
            <div className='title-logo'>
                <p className='app-title'>FinGrow</p>
                <img src="/assets/app-logo.png" className='app-logo' alt='Logo'></img>
            </div>
            <p className='title'>Welcome back to FinGrow!!</p>
           
        </div>
    )
}