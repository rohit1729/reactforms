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
    materialId: number
    materialName: string
}

interface MaterialOption {
    materialId: number,
    materialName: string
}

interface SpecificationOption {
    specificationId: number,
    specificationName: string
}


export default function CustomizedTables() {
    const [materials, setMaterials] = React.useState(['steel beam', 'glass', 'concrete']);
    const [rowCount, setRowCount] = React.useState(1);
    const [lineItems, setLineItems ] = React.useState<LineItem[]>([]);
    const [materialSelected, setMaterialSelected] = React.useState<MaterialSelected>({
        materialId: 0,
        materialName: ''
      });
    const specificationStore = React.useRef({})

    const fetchMaterialData = () => {
        try {
            fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
            .then(response => response.json())
            .then((posts) => {
                console.log("materials response");
                let names = [];
                posts.forEach(post => {
                    names.push(post['title']);
                });
                setMaterials(names);
            })
            .catch(error => console.error(error))
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };

    const fetchSpecificationData = (materialId: number) => {
        try {
            fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
            .then(response => response.json())
            .then((posts) => {
                console.log("specifications response");
                let names = [];
                posts.forEach(post => {
                    names.push(post['title']);
                });
            })
            .catch(error => console.error(error))
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };

    const memoizedMaterialData = React.useMemo(() => fetchMaterialData, []);
    React.useEffect(() => {
        memoizedMaterialData();
        if (specificationStore)
    }, [materialSelected])

    const rows = [];

    const updateRowCount = () => {
        setRowCount(rowCount + 1);
    };

    const setSelection = (type, value, rowIndex) => {
        if (lineItems[rowIndex]){
            if (type == 'material'){
                lineItems[rowIndex].material = value;
            }
            if (type == 'specification'){
                lineItems[rowIndex].specification = value;
            }
        }else{
            let lineItem = {} as LineItem;
            if (type == 'material'){
                lineItem.material = value;
            }
            if (type == 'specification'){
                lineItem.specification = value;
            }
            setLineItems([...lineItems, lineItem])
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
                            setSelection={setSelection} rowIndex={i} selectedValue="None"/>
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{width: "35%"}}></StyledTableCell>
                    <StyledTableCell align="center" style={{width: "20%"}} ></StyledTableCell>
                    <StyledTableCell align="right" style={{width: "10%"}}></StyledTableCell>
                </StyledTableRow>
            )
        } else {
            console.log("inside other"+i);
            console.log(lineItems[i].material);
            rows.push(
                <StyledTableRow key={i} vertical-align='center'>
                    <StyledTableCell>
                        <SuddecoDropDown dropdowns={materials} label="Material" type="material" rowIndex={i} 
                            setSelection={setSelection} selectedValue={lineItems[i].material}/>
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{width: "35%"}}>Sample text</StyledTableCell>
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
