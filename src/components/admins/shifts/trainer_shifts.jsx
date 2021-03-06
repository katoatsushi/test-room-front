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
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

// const useStyles = makeStyles(() => ({
//   table: {
//     minWidth: 650
//   },
//   container: {
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   textField: {
//     // width: 200,
//     marginLeft: 10,
//     marginRight: 10
//   },
// }));

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    // width: 200,
    marginLeft: 10,
    marginRight: 10
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  // ロード
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: '#4DA7F0',
    '&:hover': {
      backgroundColor: '#4DA7F0',
    },
  },
  buttonProgress: {
    color: '#4DA7F0',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
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

export default function ManageTrainerShift(){
    const classes = useStyles();
    const currentAdmin = useSelector(selectCurrentAdmin);
    const url = `/get_trainer_shifts`
    const [trainerShifts, setTrainerShifts] = useState([]);
    const [submitData, setSubmitData] = useState([]);
    const [deleteData, setDeleteData] = useState([]);
    const [stores, setStores] = useState([]);
    const [days, setDays] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [checked, setChecked] = React.useState(false);
    const [submitOpen, setSubmitOpen] = React.useState(false);
    const [shiftEdit, setShiftEdit] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const today = new Date()
    const next_month = today.getMonth() + 2
    const year = today.getFullYear();
    const history = useHistory();
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [dataSubmited, setDataSubmited] = React.useState(false);

    // eslint-disable-next-line no-unused-vars
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
            setStores(response.data.stores)
        })
        .catch(function (response) {
            console.log("error", {response})
        })
    },[])

    useEffect(()=>{
        console.log({submitData: submitData, deleteData: deleteData})
    },[deleteData, submitData])

    useEffect(()=>{
        console.log("再レンダリング")
    },[dataSubmited])


    function submitDialogOpen(){
        setSubmitOpen(true)
    }
    function handleClose(){
        setSubmitOpen(false)
    }
    function handleSubmit(){
        if (!loading) {
            setSuccess(false);
            setLoading(true);
        }
        const submit_url = `/update_trainer_shift`
        axios.put(submit_url, {
            data: submitData,
            delete: deleteData
        })
        .then(function (response) {
            // ダイアログ、ボタンを元に戻す
            setEdit(false)
            setShiftEdit(false)
            // ダイアログを閉じる
            setSuccess(true);
            setLoading(false);
            setSubmitOpen(false)

            setDataSubmited(!dataSubmited)
            // 更新成功
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
            //     setStores(response.data.stores)
            //     // ダイアログ、ボタンを元に戻す
            //     setEdit(false)
            //     setShiftEdit(false)
            //     // ダイアログを閉じる
            //     setSuccess(true);
            //     setLoading(false);
            //     setSubmitOpen(false)
            // })
            // .catch(function (response) {
            //     console.log("error", {response})
            //     // ダイアログを閉じる
            //     setSuccess(true);
            //     setLoading(false);
            //     setSubmitOpen(false)
            // })
        })
        .catch(function (response) {
            // 更新失敗
            console.log("error", {response})
            // ダイアログを閉じる
            setSuccess(true);
            setLoading(false);
            setSubmitOpen(false)
        })
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
                            {/* {r.shifts.length?( */}
                            {r.shifts?(
                                <>
                                {edit? (<>
                                    {/* 編集用 */}
                                    <ShiftTableCellEdit data={r} stores={stores} setSubmitData={setSubmitData} submitData={submitData} 
                                        setTrainerShifts={setTrainerShifts} trainerShifts={trainerShifts}
                                        setShiftEdit={setShiftEdit} setDeleteData={setDeleteData}
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
                                    // style={{display: 'inline-block', display: 'inline', color: 'blue'}}
                                    style={{display: 'inline-block',color: 'blue'}}
                                /><hr/>
                                <InputBase
                                    id="time"
                                    type="time"
                                    disabled
                                    className={classes.textField}
                                    InputLabelProps={{shrink: true,}}
                                    inputProps={{step: 300, }}
                                    // style={{display: 'inline-block', display: 'inline', color: 'blue'}}
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
            <div className={classes.wrapper}>
                <Button onClick={handleSubmit} disabled={loading || success} variant="contained" color="secondary">
                    変更を送信
                </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
            </DialogActions>
        </Dialog>
        </>
    );  
}

