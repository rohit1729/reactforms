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
    categoryId: number;
    price: number;
}

interface MaterialSelected {
    id: number
    categoryId: number
    name: string
}

interface MaterialOption {
    id: number,
    categoryId: number,
    name: string
}

interface SpecificationOption {
    id: number,
    categoryId: number,
    name: string,
}


export default function CustomizedTables() {
    const [materials, setMaterials] = React.useState<MaterialOption[]>([]);
    const [rowCount, setRowCount] = React.useState(1);
    const [specificationStore, setSpecificationStore] = React.useState(new Map())
    const [materialSelected, setMaterialSelected] = React.useState<MaterialSelected>({
        id: 0,
        categoryId: 0,
        name: ''
    });
    const lineItems = React.useRef<LineItem[]>([]);

    const fetchMaterialData = () => {
        try {
            fetch('http://localhost:8080/materials')
            .then(response => response.json())
            .then((materials) => {
                let materialOptions: MaterialOption[] = [];
                materials.forEach(material => {
                    let materialOption = {} as MaterialOption
                    materialOption.id = material['id']
                    materialOption.name = material['name']
                    materialOption.categoryId = material['categoryId']
                    materialOptions.push(materialOption)
                });
                setMaterials(materialOptions);
            })
            .catch(error => console.error(error))
        } catch (error) {
          console.error('Error fetching materials data:', error);
        }
    };

    const fetchSpecificationData = (materialCategoryId: number) => {
        try {
            let specificationOptions = [];
            const url = 'http://localhost:8080/specifications/'+materialCategoryId
            fetch(url)
            .then(response => response.json())
            .then((specifications) => {
                console.log("specifications response");
                console.log(specifications)
                specifications.forEach(specification => {
                    let specificationOption = {} as SpecificationOption
                    specificationOption.name = specification['name']
                    specificationOption.id = specification['id']
                    specificationOption.categoryId = specification['categoryId']
                    specificationOptions.push(specificationOption)
                });
                const newSpecificationStore = { ...specificationStore };
                newSpecificationStore[materialCategoryId] = specificationOptions
                console.log("setting")
                console.log(newSpecificationStore)
                setSpecificationStore(newSpecificationStore)
            })
            .catch(error => console.error(error))
        } catch (error) {
          console.error('Error fetching specification data:', error);
        }
    };

    const memoizedMaterialData = React.useMemo(() => fetchMaterialData, []);
    React.useEffect(() => {
        memoizedMaterialData();
        if (materialSelected.categoryId && !specificationStore[materialSelected.categoryId]){
            fetchSpecificationData(materialSelected.categoryId)
        }
    }, [materialSelected, rowCount])

    const rows = [];

    const updateRowCount = () => {
        setRowCount(rowCount + 1);
    };

    const setSelection = (type, option, rowIndex) => {
        // console.log("inside selection")
        if (lineItems.current[rowIndex]){
            if (type == 'material'){
                lineItems.current[rowIndex].material = option['name'];
                lineItems.current[rowIndex].materialId = option['id'];
                lineItems.current[rowIndex].categoryId = option['categoryId']
            }
            if (type == 'specification'){
                lineItems.current[rowIndex].specification = option['name'];
                lineItems.current[rowIndex].specificationId = option['id'];
            }
        }else{
            let lineItem = {} as LineItem;
            if (type == 'material'){
                lineItem.material = option['name'];
                lineItem.materialId = option['id'];
                lineItem.categoryId = option['categoryId']
            }
            if (type == 'specification'){
                lineItem.specification = option['name'];
                lineItem.specificationId = option['id'];
            }
            lineItems.current.push(lineItem)
        }
        if (type == 'material'){
            let materialSelected = {} as MaterialSelected
            materialSelected.id = option['id']
            materialSelected.name = option['name']
            materialSelected.categoryId = option['categoryId']
            setMaterialSelected(materialSelected)
        }
    }

    const removeRow = (rowIndex) => {
        const updatedLineItems = lineItems.current.filter((_, index) => index !== rowIndex);
        lineItems.current = updatedLineItems
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
            materialSelectedOption.id = lineItems.current[i].materialId
            materialSelectedOption.name = lineItems.current[i].material
            materialSelectedOption.categoryId = lineItems.current[i].categoryId

            const specificationSelectedOption = {} as SpecificationOption;
            specificationSelectedOption.id = lineItems.current[i].specificationId
            specificationSelectedOption.name = lineItems.current[i].specification
            specificationSelectedOption.categoryId = lineItems.current[i].categoryId
            let specificationDropdowns = []
            if (specificationStore[materialSelectedOption.categoryId]){
                specificationDropdowns = specificationStore[materialSelectedOption.categoryId]
            }
            rows.push(
                <StyledTableRow key={materialSelectedOption.id+'_'+specificationSelectedOption.id+'_'+i} vertical-align='center'>
                    <StyledTableCell>
                        <SuddecoDropDown dropdowns={materials} label="Material" type="material" rowIndex={i} 
                            setSelection={setSelection} selectedOption={materialSelectedOption}/>
                    </StyledTableCell>
                    <StyledTableCell>
                        <SuddecoDropDown key={"specification_"+i} dropdowns={specificationDropdowns} label="Specification" type="specification" rowIndex={i} 
                            setSelection={setSelection} selectedOption={specificationSelectedOption}/>
                    </StyledTableCell>
                    <StyledTableCell align="center" style={{width: "20%"}}>
                        <FormControl sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                            <OutlinedInput
                                size='small'
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
                        <StyledTableCell align='center'>Material</StyledTableCell>
                        <StyledTableCell align="center">Specification</StyledTableCell>
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
