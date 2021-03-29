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
import MaskedTextFieldForTrainerShift from '../masked_text_field_for_trainer_shift'
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { selectCurrentAdmin, selectAdminHeaders, adminRemove, } from '../../../slices/admin';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import CreateTableCellEdit from './create_shifts'
import ShiftTableCellEdit from './update_shifts.jsx'

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
        min.length == 1? min = "0" + min: min = min
        String(date.getHours()).length == 1? hour = "0" + String(date.getHours()): hour = String(date.getHours())
        const newDate = `${hour}:` + `${min}`
        return newDate
    }

    return(<>
        <TableCell className="cell_box" style={{backgroundColor: '#CCFFFF', marginTop: 'auto', marginBottom: 'auto', paddingRight: 5, paddingLeft: 5}}>
            {data.shifts?(<>
                {data.shifts.store?(<>
                    <span style={{color: 'grey', fontSize: 8}}>{data.shifts.store.store_name}店</span>
                </>):(<>
                    <span style={{color: 'red', fontSize: 8}}>店舗未選択</span>
                </>)}
            </>):(<></>)}
            <InputBase
                id="time"
                type="time"
                disabled
                value={setDate(data.shifts.start)}
                className={classes.textField}
                InputLabelProps={{ shrink: true, }}
                inputProps={{ step: 300, }}
                style={{display: 'inline-block', display: 'inline'}}
            /><hr/>
            <InputBase
                id="time"
                type="time"
                disabled
                value={setDate(data.shifts.finish)}
                className={classes.textField}
                InputLabelProps={{ shrink: true, }}
                inputProps={{ step: 300, }}
                style={{display: 'inline-block', display: 'inline'}}
            />
        </TableCell>
    </>)
}

export default function ManageTrainerShift(){
    const classes = useStyles();
    const currentAdmin = useSelector(selectCurrentAdmin);
    const admin_headers = useSelector(selectAdminHeaders);
    const url = `/get_trainer_shifts`
    const [trainerShifts, setTrainerShifts] = useState([]);
    const [submitData, setSubmitData] = useState([]);
    const [stores, setsStores] = useState([]);
    const [days, setDays] = useState([]);
    const [checked, setChecked] = React.useState(false);
    const [submitOpen, setSubmitOpen] = React.useState(false);
    const [shiftEdit, setShiftEdit] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const today = new Date()
    const next_month = today.getMonth() + 2
    const year = today.getFullYear();


    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    function handleSubmitButtonChange(){
        setEdit(true);
    }
    function handleSubmitButtonClose(){
        setEdit(false);
    }

    useEffect(()=>{
        console.log("シフトが変更されました")
        console.log({submitData})
        console.log({trainerShifts})
    },[submitData, trainerShifts])

    useEffect(()=>{
        axios.get(url, {
        params: {
            year: year,
            month: next_month,
            company_id: currentAdmin.company_id
        }})
        .then(function (response) {
            setTrainerShifts(response.data.data)
            setDays(response.data.date_infos)
            setSubmitData(response.data.submit_data)
            setsStores(response.data.stores)
        })
        .catch(function (response) {
            console.log("error", {response})
        })
    },[])

    function setDate(obj){
        const date = new Date(`${obj}`)
        var min = null
        var hour = null
        date.getMinutes()==0?  min = "00": min = String(date.getMinutes())
        String(date.getHours()).length == 1? hour = "0" + String(date.getHours()): hour = String(date.getHours())
        const newDate = `${hour}:` + `${min}`
        return newDate
    }
    function submitDialogOpen(){
        setSubmitOpen(true)
    }
    function handleClose(){
        setSubmitOpen(false)
    }
    function handleSubmit(){
        const submit_url = `/update_trainer_shift`
        console.log({submitData})
        axios.put(submit_url, {
            data: submitData
        })
        .then(function (response) {
            console.log({response})
            // axios.get(url, {
            // params: {
            //     year: year,
            //     month: next_month,
            //     company_id: currentAdmin.company_id
            // }})
            // .then(function (response) {
            //     setTrainerShifts(response.data.data)
            //     setDays(response.data.date_infos)
            //     setSubmitData(response.data.submit_data)
            //     setsStores(response.data.stores)
            // })
            // .catch(function (response) {
            //     console.log("error", {response})
            // })
        })
        .catch(function (response) {
            console.log("error", {response})
        })
        // ダイアログを閉じる
        setSubmitOpen(false)
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
            {trainerShifts?(<>
            {trainerShifts.map((row) => (
                <TableRow key={row.name}>
                    <TableCell className="width_auto">
                        {row.trainer.first_name_kanji} {row.trainer.last_name_kanji}
                    </TableCell>
                    
                    {row.data.map((r) => (
                        <>
                            {/* {r.shifts.length?( */}
                            {r.shifts?(
                                <>
                                {edit? (<>
                                    {/* 編集用 */}
                                    <ShiftTableCellEdit data={r} stores={stores} setSubmitData={setSubmitData} submitData={submitData} 
                                        setTrainerShifts={setTrainerShifts} trainerShifts={trainerShifts}
                                        setShiftEdit={setShiftEdit}
                                    />
                                </>) : (<>
                                    {/* 閲覧用 */}
                                    <ShiftTableCellShow data={r} />
                                </>)}
                                </>
                            ):(<>
                            {edit? (
                                <>
                                    {/* 新規作成用 */}
                                    <CreateTableCellEdit data={r} stores={stores} setSubmitData={setSubmitData} submitData={submitData} 
                                        setTrainerShifts={setTrainerShifts} trainerShifts={trainerShifts}
                                        setShiftEdit={setShiftEdit}
                                    />
                                </>
                            ):(
                                <>
                                <TableCell className="cell_box" style={{marginTop: 'auto', marginBottom: 'auto', paddingRight: 5, paddingLeft: 5}}>
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
            </>):(<></>)}
            </TableBody>
        </Table>
        </TableContainer>
        {edit? (<>
            {shiftEdit? (
                <Button variant="contained" size="large" color="secondary" onClick={submitDialogOpen}>
                    編集を完了する
                </Button>
            ): (
            <Button variant="contained" size="large" color="secondary" onClick={handleSubmitButtonClose}>
                編集を終了する
            </Button>
            )}
        </>):(
            <Button variant="contained" size="large" color="primary" onClick={handleSubmitButtonChange}>
                編集する
            </Button>
        )}
        <Dialog open={submitOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">シフト変更部分を保存する</DialogTitle>
            <DialogContent>
                シフト変更部分を保存します。このまま保存をするには「変更を送信」を、戻る場合は「キャンセルを押してください」
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} variant="contained">
                キャンセル
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="secondary">
                変更を送信
            </Button>
            </DialogActions>
        </Dialog>
        </>
    );  
}
