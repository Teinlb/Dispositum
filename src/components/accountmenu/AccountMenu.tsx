import "./accountmenu.css";

interface AccountProps {
    username: string;
    mail: string;
    signOut: () => void;
}

const AccountMenu: React.FC<AccountProps> = ({ username, mail, signOut }) => {
    return (
        <div className="accountMenu">
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
