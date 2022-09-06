import React from "react";
import BikeItem from "./BikeItem";

function BikeList(props) {
    const { bikes, users, reserveBike, isManager, reservations } = props;
    return (
        <>
            {bikes.map((bike) => (
                <BikeItem
                    key={bike.id}
                    reservations={reservations}
                    isManager={isManager}
                    bike={bike}
                    users={users}
                    reserveBike={reserveBike}
                />
            ))}
        </>
    );
}
export default BikeList;
