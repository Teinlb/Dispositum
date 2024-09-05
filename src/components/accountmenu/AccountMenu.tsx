import "./accountmenu.css";

interface AccountProps {
    username: string;
    mail: string;
    signOut: () => void;
    toggleMenu: () => void;
}

const AccountMenu: React.FC<AccountProps> = ({
    username,
    mail,
    signOut,
    toggleMenu,
}) => {
    return (
        <div className="accountMenu">
            <span
                className="material-symbols-outlined close"
                onClick={toggleMenu}
            >
                close
            </span>
            <div className="accountInfo">
                <h2>{username}</h2>
                <p>{mail}</p>
            </div>
            <hr />
            <button className="signOutButton" onClick={signOut}>
                Sign Out
            </button>
        </div>
    );
};

export default AccountMenu;
