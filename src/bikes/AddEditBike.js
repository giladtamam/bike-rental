import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { colorList } from "../constants/colors";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
import styles from "./AddEditBike.module.css";
import uniqBy from "lodash/uniqBy";

export default function AddEditBike(props) {
    const { onSave, bike = {} } = props;
    const [model, setModel] = useState(bike.model || "");
    const [location, setLocation] = useState(bike.location || "");
    const [color, setColor] = useState(bike.color || colorList[1].name);
    const [bikeModels, setBikeModels] = useState([]);
    const [isAvailable, setIsAvailable] = useState(bike.isAvailable || false);
    useEffect(() => {
        const fetchBikeModels = async () => {
            let {
                data: { data },
            } = await axios.get(
                "https://raw.githubusercontent.com/evghenix/Cars-Motorcycles-DataBase-JSON/master/moto_models.json"
            );
            data = uniqBy(data, "name");
            setBikeModels(data.map(({ name, id }) => ({ label: name, id })));
        };
        fetchBikeModels();
    }, []);

    const colorChange = (event) => {
        setColor(event.target.value);
    };

    const onAvailableChange = (event) => {
        setIsAvailable(event.target.checked);
    };

    const onModelChange = (event, { label = "" } = {}) => {
        setModel(label);
    };

    const hanleSave = () => {
        onSave({
            model,
            location,
            color,
            isAvailable,
        });
    };

    const onLocationChange = (event) => {
        setLocation(event.target.value);
    };

    return (
        <div>
            <h1>Add Bike</h1>
            <div className={styles.fields}>
                <FormControl className={styles.color}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={bikeModels}
                        sx={{ width: 300 }}
                        onChange={onModelChange}
                        value={model}
                        renderInput={(params) => (
                            <TextField {...params} label="Bike Model" />
                        )}
                    />
                    <TextField
                        required
                        onChange={onLocationChange}
                        value={location}
                        id="outlined-required"
                        label="Location"
                        placeholder="Location"
                    />
                    <InputLabel id="demo-simple-select-label">Color</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={color}
                        label="Age"
                        onChange={colorChange}
                    >
                        {colorList.map((col, index) => (
                            <MenuItem key={index} value={col.name}>
                                {col.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={onAvailableChange}
                                checked={isAvailable}
                            />
                        }
                        label="Available"
                    />
                </FormControl>
            </div>
            <Button onClick={hanleSave} variant="contained">
                Save
            </Button>
        </div>
    );
}
