import React, { useCallback, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import UserList from "./UserList";
import AddEditUser from "./AddEditUser";
import { registerWithEmailAndPasswordAndLogout } from "../services/firebase";

export default function Users(props) {
    const { users, bikes, reservations } = props;
    const [open, setOpen] = useState(false);

    const handleShow = useCallback((open) => {
        setOpen(open);
    }, []);

    const saveUser = useCallback(async(user) => {
        const { name, email, role, password } = user;
        await registerWithEmailAndPasswordAndLogout(name, email, password, role);
        setOpen(false);
    }, []);

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <UserList
                            reservations={reservations}
                            bikes={bikes}
                            users={users}
                        />
                    </TableBody>
                </Table>
            </TableContainer>
            <Button onClick={() => handleShow(true)} variant="contained">
                Add User
            </Button>
            <Modal size="lg" onClose={() => handleShow(false)} open={open}>
                <>
                    <AddEditUser onSave={saveUser} />
                </>
            </Modal>
        </>
    );
}
