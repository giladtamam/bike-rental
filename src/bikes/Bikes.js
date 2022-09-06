import React, { useState, useMemo, Fragment } from "react";
import AddEditBike from "./AddEditBike";
import BikeList from "./BikeList";
import dayjs from "dayjs";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import styles from "./Bikes.module.css";
import { colorList } from "../constants/colors";
import { updateDoc, doc, collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { modalStyle } from "../constants/modal";
import { getRating } from "../utils/rating";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

function Bikes(props) {
    const { currentUser, bikes, users, reservations } = props;
    const [color, setColor] = useState("All Colors");
    const [minRate, setMinRate] = useState(0);
    const [maxRate, setMaxRate] = useState(5);
    const [startDate, setStartDate] = useState(dayjs().startOf("day"));
    const [endDate, setEndDate] = useState(dayjs().add(7, "day"));
    const [showAddBike, setShowAddBike] = useState(false);

    const isManager = currentUser.role === "manager";

    const colorChange = (event) => {
        setColor(event.target.value);
    };

    const rateMinChange = (event) => {
        setMinRate(event.target.value);
    };

    const rateMaxChange = (event) => {
        setMaxRate(event.target.value);
    };

    const filteredBikes = useMemo(() => {
        return bikes.filter((bike) => {
            if (isManager) {
                return true;
            }
            const {
                reviews = [],
                color: bikeColor,
                isAvailable,
                reservations: reservationIds,
            } = bike;
            let avg = getRating(reviews);
            if (reviews.length === 0) {
                avg = 0;
            }

            const isBetween = reservationIds.some((reservationId) => {
                const reservation = reservations.find(
                    (reservation) => reservation.id === reservationId
                );
                const { start, end } = reservation;
                
                return (
                    (start * 1000 < dayjs(startDate).endOf('day').valueOf() &&
                        end * 1000 > dayjs(startDate).startOf('day').valueOf()) ||
                    (start * 1000 < dayjs(endDate).endOf('day').valueOf() &&
                        end * 1000 > dayjs(endDate).startOf('day').valueOf())
                );
            });
            return (
                avg >= minRate &&
                avg <= maxRate &&
                (color === "All Colors" || bikeColor === color) &&
                isAvailable &&
                !isBetween
            );
        });
    }, [
        bikes,
        minRate,
        maxRate,
        color,
        startDate,
        endDate,
        reservations,
        isManager,
    ]);

    const startDateChange = (date) => {
        setStartDate(date);
    };

    const endDateChange = (date) => {
        setEndDate(date);
    };

    const reserveBike = async (id, model) => {
        try {
            const payload = {
                userId: currentUser.id,
                bikeId: id,
                bikeModel: model,
                start: startDate.unix(),
                end: endDate.unix(),
            };

            const docRef = await addDoc(
                collection(db, "reservations"),
                payload
            );
            const bike = bikes.find((bike) => bike.id === id);
            const reservations = bike.reservations || [];
            const bikeDocRef = doc(db, "bikes", id);
            await updateDoc(bikeDocRef, {
                reservations: [...reservations, docRef.id],
            });
            const user = users.find((user) => user.id === currentUser.id);
            const userReservations = user.reservations || [];
            await updateDoc(doc(db, "users", currentUser.id), {
                reservations: [...userReservations, docRef.id],
            });
        } catch (e) {
            console.log("Failed to save new bike", e);
        }
    };

    const handleShow = () => {
        setShowAddBike(true);
    };

    const handleClose = () => {
        setShowAddBike(false);
    };

    const hanleSave = (bike) => {
        bike = { ...bike, reviews: [], reservations: [] };
        try {
            addDoc(collection(db, "bikes"), bike);
        } catch (e) {
            console.log("Failed to save new bike", e);
        } finally {
            setShowAddBike(false);
        }
    };

    return (
        <Fragment>
            {!isManager && (
                <div className={styles.filter}>
                    <div className={styles.color}>
                        <InputLabel className={styles.label} id="select-label">
                            Color
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={color}
                            label="Color"
                            onChange={colorChange}
                        >
                            {colorList.map((col, index) => (
                                <MenuItem key={index} value={col.name}>
                                    {col.name}{" "}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div className={styles.rate}>
                        <InputLabel>Rate: </InputLabel>
                        <TextField
                            id="outlined-number"
                            label="Min"
                            type="number"
                            value={minRate}
                            onChange={rateMinChange}
                            InputProps={{ inputProps: { min: 0, max: 5 } }}
                        />
                        <TextField
                            id="outlined-number"
                            label="Max"
                            type="number"
                            value={maxRate}
                            onChange={rateMaxChange}
                            min={2}
                            max={5}
                            InputProps={{ inputProps: { min: 0, max: 5 } }}
                        />
                    </div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Start Date"
                            inputFormat="MM/DD/YYYY"
                            value={startDate}
                            onChange={startDateChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DesktopDatePicker
                            label="End Date"
                            inputFormat="MM/DD/YYYY"
                            value={endDate}
                            onChange={endDateChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>
            )}
            <>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {isManager && <TableCell></TableCell>}
                                <TableCell>Model</TableCell>
                                <TableCell>Color</TableCell>
                                <TableCell>Location</TableCell>
                                {isManager && <TableCell>Availability</TableCell>}
                                <TableCell>Rating</TableCell>
                                {!isManager && <TableCell>Reserve</TableCell>}
                                {isManager && <TableCell>Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <BikeList
                                reservations={reservations}
                                isManager={isManager}
                                bikes={filteredBikes}
                                users={users}
                                reserveBike={reserveBike}
                            />
                        </TableBody>
                    </Table>
                </TableContainer>
                {isManager && (
                    <Button onClick={handleShow} variant="contained">
                        Add Bike
                    </Button>
                )}
            </>
            <Modal size="lg" onClose={handleClose} open={showAddBike}>
                <Box sx={modalStyle}>
                    <AddEditBike onSave={hanleSave} />
                </Box>
            </Modal>
        </Fragment>
    );
}
export default Bikes;
