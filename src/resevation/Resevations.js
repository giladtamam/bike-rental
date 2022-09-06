import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import dayjs from "dayjs";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useMemo } from "react";

export default function Resevations(props) {
    const { reservations = [], userId, users = [], bikes =[] } = props;
    const myReservations = useMemo(
        () =>
            reservations.filter((reservation) => reservation.userId === userId),
        [reservations, userId]
    );

    const onDeleteResevation = async(id) => {
        const reservation = reservations.find((reservation) => reservation.id === id);
        const { userId, bikeId } = reservation;
        let userReservations = users.find((user) => user.id === userId).reservations;
        userReservations = userReservations.filter((reservationId) => reservationId !== id);
        let bikeReservations = bikes.find((bike) => bike.id === bikeId).reservations;
        bikeReservations = bikeReservations.filter((reservationId) => reservationId !== id);
        try {
            await updateDoc(doc(db, "bikes", bikeId), { reservations: bikeReservations });
            await updateDoc(doc(db, "users", userId), { reservations: userReservations });
            await deleteDoc(doc(db, "reservations", id));
        } catch (error) {
            console.log('Failed to delete', error);
        }
    };
    return (
        <Card>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Bike Model</TableCell>
                            <TableCell>Start</TableCell>
                            <TableCell>End</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {myReservations.map((reservation, index) => {
                            return (
                                <TableRow
                                    key={index}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell>
                                        {reservation.bikeModel}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {dayjs(reservation.start * 1000).format(
                                            "DD/MM/YYYY"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(reservation.end * 1000).format(
                                            "DD/MM/YYYY"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="danger"
                                            title="Delete user"
                                            onClick={() =>
                                                onDeleteResevation(
                                                    reservation.id
                                                )
                                            }
                                        >
                                            <DeleteIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}
