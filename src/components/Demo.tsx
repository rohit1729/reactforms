import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import SuddecoDropDown from './SuddecoDropDown';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    }
}));

interface LineItem {
    material: string;
    materialId: number;
    specification: string;
    specificationId: number;
    price: number;
}

interface MaterialSelected {
    id: number
    name: string
}

interface MaterialOption {
    id: number,
    name: string
}

interface SpecificationOption {
    id: number,
    name: string
}


export default function CustomizedTables() {
    const [materials, setMaterials] = React.useState<MaterialOption[]>([]);
    const [rowCount, setRowCount] = React.useState(1);
    const [lineItems, setLineItems ] = React.useState<LineItem[]>([]);
    const [materialSelected, setMaterialSelected] = React.useState<MaterialSelected>({
        id: 0,
        name: ''
    });
    const specificationStore = React.useState({})

    const fetchMaterialData = () => {
        try {
            fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
            .then(response => response.json())
            .then((materials) => {
                console.log("materials response");
                let materialOptions: MaterialOption[] = [];
                materials.forEach(material => {
                    let materialOption = {} as MaterialOption
                    materialOption.id = material['id']
                    materialOption.name = material['title']
                    materialOptions.push(materialOption)
                });
                setMaterials(materialOptions);
            })
            .catch(error => console.error(error))
        } catch (error) {
          console.error('Error fetching materials data:', error);
        }
    };

    const fetchSpecificationData = (materialId: number) => {
        let specificationOptions = [];
        try {
            fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
            .then(response => response.json())
            .then((specifications) => {
                console.log("specifications response");
                specifications.forEach(specification => {
                    let specificationOption = {} as SpecificationOption
                    specificationOption.name = specification['title']
                    specificationOption.id = specification['id']
                    specificationOptions.push(specificationOption)
                });
            })
            .catch(error => console.error(error))
        } catch (error) {
          console.error('Error fetching specification data:', error);
        }
        return specificationOptions
    };

    const memoizedMaterialData = React.useMemo(() => fetchMaterialData, []);
    React.useEffect(() => {
        memoizedMaterialData();
        if (materialSelected.id && !specificationStore.current[materialSelected.id]){
            const specificationOptions = fetchSpecificationData(materialSelected.id)
            specificationStore.current[materialSelected.id] = specificationOptions
        }
    }, [materialSelected])

    const rows = [];

    const updateRowCount = () => {
        setRowCount(rowCount + 1);
    };

    const setSelection = (type, option, rowIndex) => {
        console.log("inside selection")
        if (lineItems[rowIndex]){
            console.log("inside found")
            if (type == 'material'){
                lineItems[rowIndex].material = option['name'];
                lineItems[rowIndex].materialId = option['id'];
            }
            if (type == 'specification'){
                lineItems[rowIndex].specification = option['name'];
                lineItems[rowIndex].specificationId = option['id'];
            }
        }else{
            console.log("inside not found")
            let lineItem = {} as LineItem;
            if (type == 'material'){
                lineItem.material = option['name'];
                lineItem.materialId = option['id'];
            }
            if (type == 'specification'){
                lineItem.specification = option['name'];
                lineItem.specificationId = option['id'];
            }
            setLineItems([...lineItems, lineItem])
        }
        if (type == 'material'){
            let materialSelected = {} as MaterialSelected
            materialSelected.id = option['id']
            materialSelected.name = option['name']
            setMaterialSelected(materialSelected)
        }
    }

    const removeRow = (rowIndex) => {
        const updatedLineItems = lineItems.filter((_, index) => index !== rowIndex);
        setLineItems(updatedLineItems);
        setRowCount(rowCount-1);
    }

    for (let i = 0; i < rowCount; ++i) {
        if (i == rowCount - 1) {
            rows.push(
                <StyledTableRow key={"none_"+i} vertical-align='center'>
                    <StyledTableCell style={{width: "35%"}}>
                        <SuddecoDropDown dropdowns={materials} label="Material" updateRowCount={updateRowCount} type="material"
                            setSelection={setSelection} rowIndex={i} selectedOption="None"/>
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{width: "35%"}}></StyledTableCell>
                    <StyledTableCell align="center" style={{width: "20%"}} ></StyledTableCell>
                    <StyledTableCell align="right" style={{width: "10%"}}></StyledTableCell>
                </StyledTableRow>
            )
        } else {
            const materialSelectedOption = {} as MaterialSelected;
            materialSelectedOption.id = lineItems[i].materialId
            materialSelectedOption.name = lineItems[i].material

            const specificationSelectedOption = {} as SpecificationOption;
            specificationSelectedOption.id = lineItems[i].specificationId
            specificationSelectedOption.name = lineItems[i].specification

            let specificationDropdowns = []
            if (specificationStore[materialSelectedOption.id]){
                specificationDropdowns = specificationStore[materialSelectedOption.id]
            }
            rows.push(
                <StyledTableRow key={i} vertical-align='center'>
                    <StyledTableCell>
                        <SuddecoDropDown dropdowns={materials} label="Material" type="material" rowIndex={i} 
                            setSelection={setSelection} selectedOption={materialSelectedOption}/>
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{width: "35%"}}>
                        <SuddecoDropDown dropdowns={specificationDropdowns} label="Specifications" type="material" rowIndex={i} 
                            setSelection={setSelection} selectedOption={specificationSelectedOption}/>
                    </StyledTableCell>
                    <StyledTableCell align="center" style={{width: "20%"}}>
                        <FormControl sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start">&euro;</InputAdornment>}
                                label="Amount"
                            />
                        </FormControl>
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{width: "10%"}}>
                        <IconButton aria-label="delete" size="large" color="error" onClick={() => removeRow(i)}>
                            <DeleteIcon/>
                        </IconButton>
                    </StyledTableCell>
                </StyledTableRow>
            )
        }
    }
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} style={{tableLayout: 'fixed'}} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Material</StyledTableCell>
                        <StyledTableCell align="right">Specification</StyledTableCell>
                        <StyledTableCell align="center">Price&nbsp;&euro;</StyledTableCell>
                        <StyledTableCell align="right"></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
