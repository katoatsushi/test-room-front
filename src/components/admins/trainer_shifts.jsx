import React, { useEffect, useState, Component } from 'react';
import axios from 'axios'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Grid from '@material-ui/core/Grid';
import { useTable } from 'react-table'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MaskedTextFieldForTrainerShift from './masked_text_field_for_trainer_shift'
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: 200,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

function DisabledTimeCell({checked, handleChange}){
    const classes = useStyles();
    return (<>
        {/* <TableCell className="cell_box" style={{marginTop: 'auto', marginBottom: 'auto'}}> */}
            <Checkbox
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <InputBase
                id="time"
                type="time"
                disabled
                className={classes.textField}
                InputLabelProps={{ shrink: true, }}
                inputProps={{ step: 300, }}
                style={{display: 'inline-block', display: 'inline'}}
            /><hr/>
            <InputBase
                id="time"
                type="time"
                disabled
                className={classes.textField}
                InputLabelProps={{ shrink: true, }}
                inputProps={{ step: 300, }}
                style={{display: 'inline-block', display: 'inline'}}
            />
        {/* </TableCell> */}
    </>)
}
function TimeCell({checked, handleChange, start, finish, handleStartChange, handleFinishChange}){
    const classes = useStyles();
    return (<>
        <Checkbox
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'primary checkbox' }}
        />
        <InputBase
            id="time"
            type="time"
            value={start}
            className={classes.textField}
            onChange={handleStartChange}
            InputLabelProps={{ shrink: true, }}
            inputProps={{ step: 300, }}
            style={{display: 'inline-block', display: 'inline'}}
        /><hr/>
        <InputBase
            id="time"
            type="time"
            value={finish}
            className={classes.textField}
            onChange={handleFinishChange}
            InputLabelProps={{ shrink: true, }}
            inputProps={{ step: 300, }}
            style={{display: 'inline-block', display: 'inline'}}
        />
    </>)
}

function ShiftTableCellShow({data}){
    const classes = useStyles();
    function setDate(obj){
        const date = new Date(`${obj}`)
        var min = null
        var hour = null
        date.getMinutes()==0?  min = "00": min = String(date.getMinutes())
        String(date.getHours()).length == 1? hour = "0" + String(date.getHours()): hour = String(date.getHours())
        const newDate = `${hour}:` + `${min}`
        return newDate
    }
    return(<>
        <TableCell className="cell_box" style={{backgroundColor: '#CCFFFF', marginTop: 'auto', marginBottom: 'auto'}}>
            <InputBase
                id="time"
                type="time"
                disabled
                value={setDate(data.shifts.[0].start)}
                className={classes.textField}
                InputLabelProps={{ shrink: true, }}
                inputProps={{ step: 300, }}
                style={{display: 'inline-block', display: 'inline'}}
            /><hr/>
            <InputBase
                id="time"
                type="time"
                disabled
                value={setDate(data.shifts.[0].finish)}
                className={classes.textField}
                InputLabelProps={{ shrink: true, }}
                inputProps={{ step: 300, }}
                style={{display: 'inline-block', display: 'inline'}}
            />
        </TableCell>
    </>)
}

function CreateTableCellEdit({data, setSubmitNewData}){
    const classes = useStyles();
    
    const [checked, setChecked] = React.useState(false);
    const handleChange = (event) => {
        console.log({data})
        setChecked(event.target.checked);
    };
    const [start, setStart] = React.useState();
    const [finish, setFinish] = React.useState(); 
    function handleStartChange(e) {
        console.log({data})
        console.log({e})
        console.log("aaa")
        console.log(e.target.value)
    }
    function handleFinishChange(e) {
        console.log({data})
        console.log({e})
        console.log("aaa")
        console.log(e.target.value)
    }
    return(<>
    {checked? (<>
        <TableCell className="cell_box" style={{backgroundColor: '#FFDDFF', marginTop: 'auto', marginBottom: 'auto'}}>
            <TimeCell checked={checked} handleChange={handleChange} start={start} finish={finish} 
                    handleStartChange={handleStartChange} handleFinishChange={handleFinishChange} />
        </TableCell>
    </>):(<>
        <TableCell className="cell_box" style={{marginTop: 'auto', marginBottom: 'auto'}}>
            <DisabledTimeCell checked={checked} handleChange={handleChange} />
        </TableCell>
    </>)}
    </>)
}

function ShiftTableCellEdit({data, setSubmitUpdateData, setDeleteData, submitUpdateData}){
    const classes = useStyles();
    const [checked, setChecked] = React.useState(true);
    const [edit, setEdit] = React.useState(false);
    const [start, setStart] = React.useState();
    const [finish, setFinish] = React.useState(); 
    useEffect(()=>{
        setStart(setDate(data.shifts[0].start))
        setFinish(setDate(data.shifts[0].finish))
        // console.log(start)
    },[]) 
    const handleChange = (event) => {
        setChecked(event.target.checked);
        if (!checked){
            // setDeleteData((prev)=> console.log(prev))
            setStart(setDate(data.shifts[0].start))
            setFinish(setDate(data.shifts[0].finish))
            setEdit(false);
        } else {
            // setDeleteDataにdataが存在すれば削除
        }
    };

    function handleStartChange(e) {
        setStart(e.target.value)
        setEdit(true);
        // 型: shift_data: null, start: null, end: null
        console.log({data})
        console.log({submitUpdateData}) 
        submitUpdateData.push({shift_data: data.shifts[0], start: start, end: finish});
        console.log({submitUpdateData})
        const index = submitUpdateData.findIndex(prev => prev.shift_data.id === data.shifts[0].id)
        console.log(index)
        // TODO:: submitUpdateDataのなかでdataとマッチするものがあれば、取り出し、statewを更新する
        const ChangeData = submitUpdateData.filter((thisData, index) => {
            if(thisData.shift_data.id == data.shifts[0].id){
                console.log("ああああああ")
            }
            return thisData.shift_data.id == data.shifts[0].id;
        });
    }
    function handleFinishChange(e) {
        setFinish(e.target.value)
        // setSubmitUpdateData((prev)=> console.log({prev}))
        setEdit(true);
    }

    function setDate(obj){
        const date = new Date(`${obj}`)
        var min = null
        var hour = null
        date.getMinutes()==0?  min = "00": min = String(date.getMinutes())
        String(date.getHours()).length == 1? hour = "0" + String(date.getHours()): hour = String(date.getHours())
        const newDate = `${hour}:` + `${min}`
        return newDate
    }

    return(<>
        {checked? (<>{edit? (
        <TableCell className="cell_box" style={{backgroundColor: '#f0aff0', marginTop: 'auto', marginBottom: 'auto'}}>
            <TimeCell checked={checked} handleChange={handleChange} start={start} finish={finish} 
                        handleStartChange={handleStartChange} handleFinishChange={handleFinishChange} />
        </TableCell>
        ):(
            <TableCell className="cell_box" style={{backgroundColor: '#CCFFFF', marginTop: 'auto', marginBottom: 'auto'}}>
                <TimeCell checked={checked} handleChange={handleChange} start={start} finish={finish} 
                            handleStartChange={handleStartChange} handleFinishChange={handleFinishChange} />
            </TableCell>
        )}
        </>): (
            <TableCell className="cell_box" style={{backgroundColor: '#DDDDDD' ,marginTop: 'auto', marginBottom: 'auto'}}>
                <DisabledTimeCell checked={checked} handleChange={handleChange} />
            </TableCell>
        )}
    </>)
}

export default function ManageTrainerShift(){
    const classes = useStyles();
    const url = `http://localhost:3000/get_trainer_shifts`
    const [trainerShifts, setTrainerShifts] = useState([]);
    const [days, setDays] = useState([]);
    const [checked, setChecked] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const today = new Date()
    const next_month = today.getMonth() + 2
    const year = today.getFullYear();
    const [ submitUpdateData, setSubmitUpdateData ] = React.useState([]);
    const [ submitNewData, setSubmitNewData ] = React.useState([]);
    const [ deleteData, setDeleteData ] = React.useState([{shift_data: null}]);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    function handleSubmitButtonChange(){
        setEdit(true);
    }
    function handleSubmit(){
        setEdit(false);
    }

    useEffect(()=>{
        axios.get(url, {
        params: {
            year: year,
            month: next_month
        }})
        .then(function (response) {
            setTrainerShifts(response.data.data)
            setDays(response.data.date_infos)
        })
        .catch(function (response) {
            console.log("error", {response})
        })

    },[submitUpdateData])

    function setDate(obj){
        const date = new Date(`${obj}`)
        var min = null
        var hour = null
        date.getMinutes()==0?  min = "00": min = String(date.getMinutes())
        String(date.getHours()).length == 1? hour = "0" + String(date.getHours()): hour = String(date.getHours())
        const newDate = `${hour}:` + `${min}`
        return newDate
    }
    return(
        <>
        <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
                    <TableRow>
                        <TableCell style={{textAlign: 'center'}}>
                            {next_month}<br/>
                            月
                        </TableCell>
                        {days.map((row) => (
                            <TableCell style={{textAlign: 'center'}} component="th" scope="row" className="cell_box">
                                {row[0]}
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell/>
                        {days.map((row) => (
                            <TableCell style={{textAlign: 'center'}} component="th" scope="row" className="cell_box">
                                {row[1]}
                            </TableCell>
                        ))}
                    </TableRow>
            </TableHead>
            <TableBody>
            {trainerShifts.map((row) => (
                <TableRow key={row.name}>
                    <TableCell className="width_auto">
                        {row.trainer.first_name_kanji} {row.trainer.last_name_kanji}
                    </TableCell>
                    
                    {row.data.map((r) => (
                        <>
                            {r.shifts.length?(
                                <>
                                {edit? (
                                    <ShiftTableCellEdit data={r} submitUpdateData={submitUpdateData} setSubmitUpdateData={setSubmitUpdateData} setDeleteData={setDeleteData}/>
                                ) : (
                                    <ShiftTableCellShow data={r} />
                                )}
                                </>
                            ):(<>
                            {edit? (
                                <>
                                    <CreateTableCellEdit data={r} setSubmitNewData={setSubmitNewData}/>
                                </>
                            ):(
                                <>
                                <TableCell className="cell_box" style={{marginTop: 'auto', marginBottom: 'auto'}}>
                                <InputBase
                                    id="time"
                                    type="time"
                                    disabled
                                    className={classes.textField}
                                    InputLabelProps={{shrink: true,}}
                                    inputProps={{step: 300, }}
                                    style={{display: 'inline-block', display: 'inline', color: 'blue'}}
                                /><hr/>
                                <InputBase
                                    id="time"
                                    type="time"
                                    disabled
                                    className={classes.textField}
                                    InputLabelProps={{shrink: true,}}
                                    inputProps={{step: 300, }}
                                    style={{display: 'inline-block', display: 'inline', color: 'blue'}}
                                />
                                </TableCell>
                                </>
                            )}
                            </>)}

                        </>
                    ))}
                    
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
        {edit? (
            <Button variant="contained" size="large" color="secondary" onClick={handleSubmit}>
                編集を完了する
            </Button>
        ):(
            <Button variant="contained" size="large" color="primary" onClick={handleSubmitButtonChange}>
                編集する
            </Button>
        )}
        </>
    );  
}

