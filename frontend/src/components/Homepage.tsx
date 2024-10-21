import { useContext } from "react";
import { UserContext } from "../contexts/user";
import '../styles/Homepage.css';

export function Homepage(): JSX.Element {
    const { currentUser } = useContext(UserContext);

    return (
        <div className="homepage-container">
            <div className="titles-image">
                <div className="titles-body">
                    <h1 className="welcome-message">Welcome <span className="username">{currentUser.username.toUpperCase()}</span></h1>
                    <h1 className="title-subtitle">FinGrow: Track, Save and Thrive</h1>
                </div>
                <div className="image-body">
                    <img src={'/assets/homepage.png'} className="image" alt="app-image"></img>
                </div>
            </div>
        </div>
    )
}