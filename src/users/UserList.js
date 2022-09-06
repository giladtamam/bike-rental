import React, { Fragment } from "react";
import UserItem from "./UserItem";

function UserList(props) {
    const { users, isManager, reservations, bikes } = props;
    return (
        <>
            {users.map((user) => {
                return (
                    <Fragment key={user.id}>
                        <UserItem
                            isManager={isManager}
                            bikes={bikes}
                            reservations={reservations}
                            user={user}
                        />
                    </Fragment>
                );
            })}
        </>
    );
}
export default UserList;
