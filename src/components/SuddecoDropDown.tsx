import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function SuddecoDropDown(props) {
    const [material, setMaterial] = React.useState('');
    const [used, setUsed] = React.useState(false);

    const handleChange = (event: SelectChangeEvent) => {
        setMaterial(event.target.value as string);

        // first time selection adds a row again at bottom
        if (!used && props.updateRowCount){
            props.updateRowCount();
            setUsed(true);
        }
        if (props.setSelection){
            props.setSelection(props.type, material, props.rowIndex);
        }
    }

    if (props.selectedValue){
        console.log("selected value passed: "+props.selectedValue);
        setMaterial(props.selectedValue);
    }

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size='small'>
                <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={material}
                    label={props.label}
                    onChange={handleChange}
                >
                     {props.dropdowns.map((item) => (
                        <MenuItem value={item}>{item}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
