/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import {  makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import { selectCurrentAdmin } from '../../../slices/admin';
import { useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CreateTableCellEdit from './create_shifts'
import ShiftTableCellEdit from './update_shifts.jsx'
import ReactVirtualizedTable from './sample'

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 650
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: 10,
    marginRight: 10
  },
}));

function ShiftTableCellShow({data}){
    const classes = useStyles();

    function setDate(obj){
        const date = new Date(`${obj}`)
        var min = null
        var hour = null
        date.getMinutes()==0?  min = "00": min = String(date.getMinutes())
        min.length == 1? min = "0" + min: min
        String(date.getHours()).length == 1? hour = "0" + String(date.getHours()): hour = String(date.getHours())
        const newDate = `${hour}:` + `${min}`
        return newDate
    }

    return(<>
        <TableCell className="cell_box" style={{backgroundColor: '#CCFFFF', marginTop: 'auto', marginBottom: 'auto', paddingRight: 5, paddingLeft: 5}}>
            {data.shifts?(<>
                {data.shifts.store?(<>
                    <span style={{color: 'grey', fontSize: 8}}>{data.shifts.store.store_name}???</span>
                </>):(<>
                    <span style={{color: 'red', fontSize: 8}}>???????????????</span>
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
                style={{display: 'inline-block'}}
            /><hr/>
            <InputBase
                id="time"
                type="time"
                disabled
                value={setDate(data.shifts.finish)}
                className={classes.textField}
                InputLabelProps={{ shrink: true, }}
                inputProps={{ step: 300, }}
                style={{display: 'inline-block'}}
            />
        </TableCell>
    </>)
}

// ManageTrainerShift???next_month???this_month??????????????????
export default function ThisMonthTrainerShift(props){
    const classes = useStyles();
    const currentAdmin = useSelector(selectCurrentAdmin);
    const url = `/get_trainer_shifts`
    const [trainerShifts, setTrainerShifts] = useState([]);
    const [submitData, setSubmitData] = useState([]);
    const [deleteData, setDeleteData] = useState([]);
    const [stores, setStores] = useState([]);
    const [days, setDays] = useState([]);
    const [submitOpen, setSubmitOpen] = React.useState(false);
    const [shiftEdit, setShiftEdit] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const month = props.match.params.month
    const today = new Date()
    const year = today.getFullYear();

    // eslint-disable-next-line no-unused-vars
    function handleSubmitButtonChange(){
        setEdit(true);
    }
    function handleSubmitButtonClose(){
        setEdit(false);
    }

    useEffect(()=>{
        axios.get(url, {
        params: {
            year: year,
            month: month,
            company_id: currentAdmin.company_id
        }})
        .then(function (response) {
            setTrainerShifts(response.data.data)
            setDays(response.data.date_infos)
            setSubmitData(response.data.submit_data)
            setStores(response.data.stores)
        })
        .catch(function (response) {
            console.log("error", {response})
        })
    },[])

    function submitDialogOpen(){
        setSubmitOpen(true)
    }
    function handleClose(){
        setSubmitOpen(false)
    }
    function handleSubmit(){
        const submit_url = `/update_trainer_shift`
        axios.put(submit_url, {
            data: submitData,
            delete: deleteData
        })
        .then(function (response) {
            axios.get(url, {
            params: {
                year: year,
                month: month,
                company_id: currentAdmin.company_id
            }})
            .then(function (response) {
                setTrainerShifts(response.data.data)
                setDays(response.data.date_infos)
                setSubmitData(response.data.submit_data)
                setStores(response.data.stores)
                // ??????????????????????????????????????????
                setEdit(false)
                setShiftEdit(false)
            })
            .catch(function (response) {
                console.log("error", {response})
            })
        })
        .catch(function (response) {
            console.log("error", {response})
        })
        // ???????????????????????????
        setSubmitOpen(false)
    }

    useEffect(()=>{
        console.log({submitData: submitData, deleteData: deleteData})
    },[deleteData, submitData])

    return(
        <>

        {/* <ReactVirtualizedTable/> */}
        <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
                    <TableRow>
                        <TableCell style={{textAlign: 'center'}}>
                            {month}<br/>
                            ???
                        </TableCell>
                        {days.map((row, index) => (
                            <TableCell key={index} style={{textAlign: 'center'}} component="th" scope="row" className="cell_box">
                                {row[0]}
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell/>
                        {days.map((row, index) => (
                            <TableCell key={index} style={{textAlign: 'center'}} component="th" scope="row" className="cell_box">
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
                            {r.shifts?(
                                <>
                                {edit? (<>
                                    {/* ????????? */}
                                    <ShiftTableCellEdit data={r} stores={stores} setSubmitData={setSubmitData} submitData={submitData} 
                                        setTrainerShifts={setTrainerShifts} trainerShifts={trainerShifts}
                                        setShiftEdit={setShiftEdit} setDeleteData={setDeleteData}
                                    />
                                </>) : (<>
                                    {/* ????????? */}
                                    <ShiftTableCellShow data={r} />
                                </>)}
                                </>
                            ):(<>
                            {edit? (
                                <>
                                    {/* ??????????????? */}
                                    <CreateTableCellEdit data={r} stores={stores}  submitData={submitData} 
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
                                    style={{display: 'inline-block',color: 'blue'}}
                                /><hr/>
                                <InputBase
                                    id="time"
                                    type="time"
                                    disabled
                                    className={classes.textField}
                                    InputLabelProps={{shrink: true,}}
                                    inputProps={{step: 300, }}
                                    style={{display: 'inline-block',color: 'blue'}}
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
                    ?????????????????????
                </Button>
            ): (
            <Button variant="contained" size="large" color="secondary" onClick={handleSubmitButtonClose}>
                ?????????????????????
            </Button>
            )}
        </>):(
            <Button variant="contained" size="large" color="primary" onClick={handleSubmitButtonChange}>
                ????????????
            </Button>
        )}
        <Dialog open={submitOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">????????????????????????????????????</DialogTitle>
            <DialogContent>
                ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} variant="contained">
                ???????????????
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="secondary">
                ???????????????
            </Button>
            </DialogActions>
        </Dialog>
        </>
    );  
}

