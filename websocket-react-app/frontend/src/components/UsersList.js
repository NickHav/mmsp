function UsersList({ users }) {

    return (
        <div className="chat_users_area">
            <div className="user-list-wrapper">
                <ul className="user-list">
                    {users.map((user, index) => (
                        <li
                            key={index}
                            data-author={user.isCurrentUser ? 'me' : 'other'}
                        >
                            <img src={`https://picsum.photos/seed/${user}/200`} alt="User picture" />
                            <span>{user}</span>
                            <div className="user-actions">
                                <button title="Message">
                                    <img
                                        src="https://img.icons8.com/?size=100&id=108791&format=png&color=000000"
                                        alt="Click"
                                    />
                                </button>
                                <button title="Mute">
                                    <img
                                        src="https://img.icons8.com/?size=100&id=UEHZ7BYT59UY&format=png&color=000000"
                                        alt="Click"
                                    />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default UsersList;