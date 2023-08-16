import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';



export default function SuddecoDropDown(props) {
    const [selection, setSelection] = React.useState(0);
    const [used, setUsed] = React.useState(false);
    const selectionName = React.useRef('')
    const selectionCategoryId = React.useRef(0)
    const selectionUnit = React.useRef('')

    React.useEffect(() => {
        setSelection(0)
    }, [])

    const handleChange = (event: SelectChangeEvent) => {
        const selection = event.target.value as unknown as number
        setSelection(selection);

        if (props.setSelection){
            const selectedOption = {}
            selectedOption['id'] = selection
            selectedOption['name'] = selectionName.current
            selectedOption['categoryId'] = selectionCategoryId.current
            selectedOption['unit'] = selectionUnit.current
            props.setSelection(props.type, selectedOption, props.rowIndex);
        }

        // first time selection adds a row again at bottom
        if (!used && props.updateRowCount){
            props.updateRowCount();
            setUsed(true);
        }
    }

    const getSelection = () => {
        if (selection){
            return selection
        }
        if (props.selectedOption){
            return props.selectedOption['id'];
        }
        return selection;
    }

    const setSelectionNameAndCategory = (item) => {
        selectionName.current = item['name'];
        selectionCategoryId.current = item['categoryId']
        if (item['unit']){
            selectionUnit.current = item['unit']
        }
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
                        <MenuItem value={item['id']} 
                            onClick={(e) => {setSelectionNameAndCategory(item)}}>{item['name']}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}