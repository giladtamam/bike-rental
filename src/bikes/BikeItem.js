import React, { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import BikeRating from "./BikeRating";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { deleteDoc, updateDoc, doc } from "firebase/firestore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import AddEditBike from "./AddEditBike";
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import Collapse from "@mui/material/Collapse";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import { db } from "../services/firebase";
import { modalStyle } from "../constants/modal";
import dayjs from "dayjs";
const BikeItem = (props) => {
    const {
        bike,
        reserveBike,
        isManager,
        users = [],
        reservations = [],
    } = props;
    const {
        isAvailable,
        location,
        model,
        color,
        reviews = [],
        reservations: reservationIds = [],
        id,
    } = bike;

    const [editBike, setEditBike] = useState(false);
    const [open, setOpen] = React.useState(false);

    const reservedUsers = useMemo(() => {
        if (reservations.length === 0) {
            return [];
        }
        return reservationIds.map((reservationId) => {
            const reservation = reservations.find(
                (reservation) => reservation.id === reservationId
            );
            const user = users.find((user) => user.id === reservation.userId);
            return { ...user, start: reservation.start, end: reservation.end };
        });
    }, [reservationIds, reservations, users]);

    const onEditBike = async (bike) => {
        const bikeDocRef = doc(db, "bikes", id);
        try {
            await updateDoc(bikeDocRef, bike);
            handleClose();
        } catch (err) {
            alert(err);
        }
    };

    const onDeleteBike = (id) => {
        deleteDoc(doc(db, "bikes", id));
    };

    const showEditModal = () => {
        setEditBike(true);
    };

    const handleClose = () => {
        setEditBike(false);
    };

    return (
        <>
            <TableRow
                key={bike.id}
                sx={{
                    "&:last-child td, &:last-child th": {
                        border: 0,
                    },
                }}
            >
                {isManager && (
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
                )}
                <TableCell>{model}</TableCell>
                <TableCell>{color}</TableCell>
                <TableCell>{location}</TableCell>
                { isManager && (
                    <TableCell>
                        <Checkbox checked={isAvailable} disabled />
                    </TableCell>
                )}
                <TableCell>
                    <BikeRating
                        isManager={isManager}
                        reviews={reviews}
                        bikeId={id}
                    />
                </TableCell>
                {!isManager && (
                    <TableCell>
                        <Button
                            onClick={() => reserveBike(id, model)}
                            variant="contained"
                        >
                            {"Reserve"}
                        </Button>
                    </TableCell>
                )}

                {isManager && (
                    <TableCell>
                        <Button
                            variant="info"
                            title="Edit bike details"
                            onClick={showEditModal}
                        >
                            <EditIcon />
                        </Button>
                        <Button
                            variant="danger"
                            title="Delete bike"
                            onClick={() => onDeleteBike(bike.id)}
                        >
                            <DeleteIcon />
                        </Button>
                    </TableCell>
                )}
                <Modal size="lg" onClose={handleClose} open={editBike}>
                    <Box sx={modalStyle}>
                        <AddEditBike bike={bike} onSave={onEditBike} />
                    </Box>
                </Modal>
            </TableRow>
            {isManager && (
                <TableRow>
                    <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={7}
                    >
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    component="div"
                                >
                                    Users who reserved this bike
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell>Start</TableCell>
                                            <TableCell>End</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {reservedUsers.map((user, index) => (
                                            <TableRow key={index}>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {user.name}
                                                </TableCell>
                                                <TableCell>
                                                    {user.email}
                                                </TableCell>
                                                <TableCell>
                                                    {user.role}
                                                </TableCell>
                                                <TableCell>
                                                    {dayjs(
                                                        user.start * 1000
                                                    ).format("DD/MM/YYYY")}
                                                </TableCell>
                                                <TableCell>
                                                    {dayjs(
                                                        user.end * 1000
                                                    ).format("DD/MM/YYYY")}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

export default BikeItem;
