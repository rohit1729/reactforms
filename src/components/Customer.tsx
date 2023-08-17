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
import BottomNavigation from '@mui/material/BottomNavigation';
import { Alert, Button, Snackbar } from '@mui/material';

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
    material: string
    materialId: number
    specification: string
    specificationId: number
    categoryId: number
    price: number
    unit: string
    quantity: number
    amount: number
}

interface MaterialSelected {
    id: number
    categoryId: number
    name: string
}

interface SpecificationSelected {
    id: number
    categoryId: number
    name: string
    unit: string
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
    unit: string
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
    const [specificationSelected, setSpecificationSelected] = React.useState<SpecificationSelected>({
        id: 0,
        categoryId: 0,
        name: '',
        unit: ''
    });
    const [prices, setPrices] = React.useState([])
    const [amounts, setAmounts] = React.useState([])
    const [snackState, setSnackState] = React.useState(false);
    const lineItems = React.useRef<LineItem[]>([]);
    const currentIndex = React.useRef(0);

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
                specifications.forEach(specification => {
                    let specificationOption = {} as SpecificationOption
                    specificationOption.name = specification['name']
                    specificationOption.id = specification['id']
                    specificationOption.categoryId = specification['categoryId']
                    specificationOption.unit = specification['unit']
                    specificationOptions.push(specificationOption)
                });
                const newSpecificationStore = { ...specificationStore };
                newSpecificationStore[materialCategoryId] = specificationOptions
                setSpecificationStore(newSpecificationStore)
            })
            .catch(error => console.error(error))
        } catch (error) {
          console.error('Error fetching specification data:', error);
        }
    };

    const updatePrices = (value: number, index: number) => {
        console.log("inside price udpate: "+value)
        let newPrices = [ ...prices]
        if (index >= newPrices.length){
            newPrices.push(value)
        }else{
            newPrices[index] = value
        }
        setPrices(newPrices)
    }

    const updateAmounts = (price: number, index: number) => {
        let newAmounts = [ ...amounts]
        let amount = undefined as number
        if (price){
            amount = price * lineItems.current[index].quantity
        }
        if (index >= amounts.length){
            newAmounts.push(amount)
        }else{
            newAmounts[index] = amount
        }
        setAmounts(newAmounts)
    }

    const fetchPrice = () => {
        try {
            const index = currentIndex.current
            if (lineItems.current[index]){
                const materialId = lineItems.current[index].materialId
                const specificationId = lineItems.current[index].specificationId
                if (materialId && specificationId){
                    const url = 'http://localhost:8080/pricings/final?materialId='+materialId+"&specificationId="+specificationId
                    console.log("price fetch url:" +url)
                    fetch(url)
                    .then(response => response.json())
                    .then((price) => {
                        console.log("price response for index"+index);
                        const value = price['price']
                        console.log(value);
                        updatePrices(value, index)
                        updateAmounts(value, index)
                    })
                    .catch(error => console.error(error))
                }else{
                    updatePrices(undefined, index)
                    updateAmounts(undefined, index)
                }
            }
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
        console.log("inside effect")
        fetchPrice()
    }, [materialSelected, rowCount, specificationSelected])

    const rows = [];

    const updateRowCount = () => {
        setRowCount(rowCount + 1);
    };

    const setQuantityForLineItem = (index: number, quantity: number) => {
        lineItems.current[index].quantity = quantity
        updateAmounts(prices[index], index)
    }

    const getQuantityForLineItem = (index: number) => {
        if (lineItems.current[index].quantity){
            return lineItems.current[index].quantity
        }
        return 0
    }

    const getPriceDisplayText = (index: number) => {
        if (lineItems.current[index].unit){
            return prices[index]+"/"+lineItems.current[index].unit
        }
        return prices[index]
    }

    const getAmountDisplayText = (index: number) => {
        if (amounts[index]){
            return "\u20AC "+amounts[index]
        }
    }

    const setSelection = (type, option, rowIndex) => {
        currentIndex.current = rowIndex
        if (lineItems.current[rowIndex]){
            if (type == 'material'){
                lineItems.current[rowIndex].material = option['name'];
                lineItems.current[rowIndex].materialId = option['id'];
                lineItems.current[rowIndex].categoryId = option['categoryId']
                lineItems.current[rowIndex].specificationId = undefined
            }
            if (type == 'specification'){
                lineItems.current[rowIndex].specification = option['name'];
                lineItems.current[rowIndex].specificationId = option['id'];
                lineItems.current[rowIndex].unit = option['unit']
            }
        }else{
            let lineItem = {} as LineItem;
            lineItem.quantity = 0
            if (type == 'material'){
                lineItem.material = option['name'];
                lineItem.materialId = option['id'];
                lineItem.categoryId = option['categoryId']
                lineItem.specificationId = undefined
            }
            if (type == 'specification'){
                lineItem.specification = option['name'];
                lineItem.specificationId = option['id'];
                lineItem.unit = option['unit']
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
        if (type == 'specification'){
            let specficationSelected = {} as SpecificationSelected
            specficationSelected.id = option['id']
            specficationSelected.name = option['name']
            specficationSelected.categoryId = option['categoryId']
            specficationSelected.unit = option['unit']
            setSpecificationSelected(specficationSelected)
        }
    }

    const removeRow = (rowIndex) => {
        const updatedLineItems = lineItems.current.filter((_, index) => index !== rowIndex);
        lineItems.current = updatedLineItems

        const newPrices = [ ... prices]
        const updatedPrices = newPrices.filter((_, index) => index !== rowIndex);
        setPrices(updatedPrices)

        const newAmounts = [ ... amounts]
        const updatedAmounts = newAmounts.filter((_, index) => index !== rowIndex);
        setAmounts(updatedAmounts)

        setRowCount(rowCount-1);
    }

    const closeSnackBar = () => {
        setSnackState(false)
    }

    const getButtonState = () => {
        return snackState
    }

    const submitPrices = () => {
        let requestBody = []
        for (let i = 0; i < lineItems.current.length; ++i){
            let priceRequest = {}
            const lineItem = lineItems.current[i]
            priceRequest['materialId'] = lineItem.materialId
            priceRequest['specificationId'] = lineItem.specificationId
            priceRequest['price'] = lineItem.price
            requestBody.push(priceRequest)
        }
        var myJsonString = JSON.stringify(requestBody);
        console.log("the request body")
        console.log(myJsonString)
        fetch('http://localhost:8080/pricings', {
            method: 'POST',
            body: myJsonString,
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            })
             .then((response) => {
                setSnackState(true)
             })
             .catch((err) => {
                console.log(err.message);
        });
    }

    const getSumTotal = () => {
        let total = 0;
        for (let i = 0; i < amounts.length; ++i){
            if (amounts[i]){
                total += amounts[i]
            }
        }
        return "\u20AC "+total
    }

    for (let i = 0; i < rowCount; ++i) {
        if (i == rowCount - 1) {
            rows.push(
                <StyledTableRow key={"none_"+i} vertical-align='center'>
                    <StyledTableCell style={{width: "35%"}}>
                        <SuddecoDropDown dropdowns={materials} label="Material" updateRowCount={updateRowCount} type="material"
                            setSelection={setSelection} rowIndex={i} selectedOption="None"/>
                    </StyledTableCell>
                    <StyledTableCell align="center" style={{width: "35%"}}></StyledTableCell>
                    <StyledTableCell align="center" style={{width: "10%"}} ></StyledTableCell>
                    <StyledTableCell align="center" style={{width: "10%"}}></StyledTableCell>
                    <StyledTableCell align="center" style={{width: "10%"}}></StyledTableCell>
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
            specificationSelectedOption.unit = lineItems.current[i].unit

            let specificationDropdowns = []
            if (specificationStore[materialSelectedOption.categoryId]){
                specificationDropdowns = specificationStore[materialSelectedOption.categoryId]
            }

            console.log("price to set:")
            console.log(prices)
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
                    <StyledTableCell key={"price_"+i} align='center'>
                        {getPriceDisplayText(i)}
                    </StyledTableCell>
                    <StyledTableCell align="center" style={{width: "20%"}}>
                        <FormControl sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Quantity</InputLabel>
                            <OutlinedInput onChange={(e) => {
                                const value = e.target.value as unknown as number
                                setQuantityForLineItem(i, value)
                            }}
                                defaultValue={getQuantityForLineItem(i)}
                                size='small'
                                id="outlined-adornment-amount"
                                label="Amount"
                            />
                        </FormControl>
                    </StyledTableCell>
                    <StyledTableCell align="center" style={{width: "10%"}}>
                        {getAmountDisplayText(i)}
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
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} style={{tableLayout: 'fixed'}} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='center'>Material</StyledTableCell>
                            <StyledTableCell align="center">Specification</StyledTableCell>
                            <StyledTableCell align="center">Price&nbsp;&euro;</StyledTableCell>
                            <StyledTableCell align="center">Quantity</StyledTableCell>
                            <StyledTableCell align="center">Amount&nbsp;&euro;</StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows}
                    </TableBody>
                </Table>
            </TableContainer>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, boxShadow:'none'}} 
                style={{paddingTop:'12px', paddingBottom: '12px', zIndex:10}} elevation={3}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} style={{tableLayout: 'fixed'}} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell style={{background: 'white'}} align='center'></StyledTableCell>
                                <StyledTableCell style={{background: 'white'}} align="center"></StyledTableCell>
                                <StyledTableCell style={{background: 'white'}} align="center"></StyledTableCell>
                                <StyledTableCell style={{background: 'white'}} align="center"></StyledTableCell>
                                <StyledTableCell style={{background: 'white', color: 'black'}} align="center">TOTAL: {getSumTotal()}</StyledTableCell>
                                <StyledTableCell style={{background: 'white'}} align="right"></StyledTableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
            </Paper>
            <Snackbar
                open={snackState}
                onClose={closeSnackBar}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert elevation={20} severity="success">Price data updated!</Alert>
            </Snackbar>
        </div>

    );
}
