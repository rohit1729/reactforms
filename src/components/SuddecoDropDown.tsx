import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function SuddecoDropDown(props) {
    const [material, setMaterial] = React.useState('');
    const [used, setUsed] = React.useState(false);

    console.log("inside render of dropdown")
    console.log(material)

    const handleChange = (event: SelectChangeEvent) => {
        const selection = event.target.value as string
        setMaterial(selection);

        if (props.setSelection){
            props.setSelection(props.type, selection, props.rowIndex);
        }

        // first time selection adds a row again at bottom
        if (!used && props.updateRowCount){
            props.updateRowCount();
            setUsed(true);
        }
    }

    const getSelection = () => {
        if (material){
            return material
        }
        if (props.selectedValue){
            return props.selectedValue;
        }
        return material;
    }

    return (
        <Box>
            <FormControl style={{ width: '100%' }} size='small'>
                <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={getSelection()}
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
