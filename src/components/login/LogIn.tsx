import "./login.css";

interface LogInProps {
    signIn: () => void;
}

const LogIn: React.FC<LogInProps> = ({ signIn }) => {
    return (
        <div className="loginComp">
            <h1>Dispositum</h1>
            <div className="login-container">
                <button className="login" onClick={signIn}>Log In</button>
            </div>
        </div>
    );
};

export default LogIn;
