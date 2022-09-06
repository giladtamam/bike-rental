import { useCallback, useMemo, useState } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import AddEditUser from "./AddEditUser";
import TableBody from "@mui/material/TableBody";
import Collapse from "@mui/material/Collapse";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import Box from "@mui/material/Box";

export default function UserItem(props) {
    const { user, reservations = [], bikes } = props;
    const { reservations: reservationIds = [] } = user;
    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);

    const reservedBikes = useMemo(() => {
        if (reservationIds.length === 0) {
            return [];
        }
        
        return reservationIds.map((reservationId) => {
            const reservation = reservations.find(
                (reservation) => reservation.id === reservationId
            );
            
            if (reservation) {
                const bike = bikes.find((bike) => bike.id === reservation.bikeId);
                const { start, end } = reservation;
                return { ...bike, start, end };
            }
            return null;
        }).filter(Boolean);
    }, [reservationIds, reservations, bikes]);

    const onDeleteUser = useCallback((id) => {
        deleteDoc(doc(db, "users", id));
    }, []);

    const onEditUser = useCallback(async (updatedUser) => {
        try {
            await updateDoc(doc(db, "users", user.id), updatedUser);
            setShow(false);
        } catch (e) {
            console.log('Failed to update user', e);
        }
    }, [user.id]);

    return (
        <>
            <TableRow
                sx={{
                    "&:last-child td, &:last-child th": {
                        border: 0
                    }
                }}
            >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role || "User"}</TableCell>
                <TableCell>
                    <Button
                        variant="info"
                        title="Edit user details"
                        onClick={() => setShow(true)}
                    >
                        <EditIcon />
                    </Button>
                    <Button
                        variant="danger"
                        title="Delete user"
                        onClick={() => onDeleteUser(user.id)}
                    >
                        <DeleteIcon />
                    </Button>
                </TableCell>
                <Modal size="lg" open={show}>
                    <>
                        <AddEditUser edit onSave={onEditUser} user={user} />
                    </>
                </Modal>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={5}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                Bikes reserved by {user.name}
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Model</TableCell>
                                        <TableCell>Color</TableCell>
                                        <TableCell>Location</TableCell>
                                        <TableCell>Start</TableCell>
                                        <TableCell>End</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reservedBikes.map((bike, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {bike.model}
                                                </TableCell>
                                                <TableCell>
                                                    {bike.color}
                                                </TableCell>
                                                <TableCell>
                                                    {bike.location}
                                                </TableCell>
                                                <TableCell>
                                                    {dayjs(
                                                        bike.start * 1000
                                                    ).format("DD/MM/YYYY")}
                                                </TableCell>
                                                <TableCell>
                                                    {dayjs(
                                                        bike.end * 1000
                                                    ).format("DD/MM/YYYY")}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}
