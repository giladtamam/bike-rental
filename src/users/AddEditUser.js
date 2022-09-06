import React, { useCallback, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { modalStyle } from "../constants/modal";

export default function AddEditUser({ onSave, edit, user = {} }) {
    const { name = '', email = '', role = 'user'} = user;
    const [newUser, setNewUser] = useState({
        name, email, role, password: ""
    });
    const handleRoleChange = useCallback((e) => {
        setNewUser({ ...newUser, role: e.target.value });
    }, [setNewUser, newUser]);

    const onNameChange = useCallback((e) => {
        setNewUser({ ...newUser, name: e.target.value });
    }, [setNewUser, newUser]);

    const onEmailChange = useCallback((e) => {
        setNewUser({ ...newUser, email: e.target.value });
    }, [setNewUser, newUser]);

    const onPasswordChange = useCallback((e) => {
        setNewUser({ ...newUser, password: e.target.value });
    }, [setNewUser, newUser]);

    return (
        <>
            <Box sx={modalStyle}>
                <div >
                    <FormControl style={{ display: 'flex', flexDirection: 'row' }} className="color-selector">
                        <TextField
                            required
                            id="outlined-required"
                            label="Name"
                            placeholder="Full Name"
                            onChange={onNameChange}
                            value={newUser.name}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            value={newUser.email}
                            label="Email"
                            placeholder="Email"
                            onChange={onEmailChange}
                            InputProps={{
                                type: "email",
                            }}
                        />
                        {!edit && (
                            <TextField
                                required
                                id="outlined-required"
                                label="Password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={onPasswordChange}
                                InputProps={{
                                    type: "password",
                                }}
                            />
                        )}
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={newUser.role}
                            style={{ width: '150px' }}
                            onChange={handleRoleChange}
                        >
                            <MenuItem value={"manager"}>Manager</MenuItem>
                            <MenuItem value={"user"}>User</MenuItem>
                        </Select>
                        <Button onClick={() => onSave(newUser)} variant="contained">
                            Save User
                        </Button>
                    </FormControl>
                </div>
            </Box>
        </>
    );
}
