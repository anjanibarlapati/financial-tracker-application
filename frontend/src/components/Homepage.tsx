import { useContext } from "react";
import { UserContext } from "../contexts/user";
import '../styles/Homepage.css';

export function Homepage(): JSX.Element {
    const { currentUser } = useContext(UserContext);

    return (
        <div className="homepage-container">
            <h1 className="welcome-message">Welcome <span className="username">{currentUser.username.toUpperCase()}</span></h1>
        </div>
    )
}