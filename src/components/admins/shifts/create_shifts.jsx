/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import {  makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(() => ({
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
}));


export default function CreateTableCellEdit({data, setSubmitData, stores, submitData, setShiftEdit}){
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [checked, setChecked] = React.useState(false);
    const [start, setStart] = React.useState([]);
    const [finish, setFinish] = React.useState([]);
    const [selectStore, setSelectStore] = React.useState();
    const [inputCheck, setInputCheck] = React.useState({start: false, finish: false, store: false});

    useEffect(()=>{
        if(data.shifts){
            setChecked(true)
        }
    },[])

    const handleChange = (event) => {
        if(event.target.checked){
            setOpen(true);
        }else{
            console.log({data},"削除")
        }
        setChecked(event.target.checked);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function handleStartChange(e) {
        setStart(e.target.value)
        setInputCheck({start: true, finish: inputCheck.finish, store: inputCheck.store})
    }
    function handleFinishChange(e) {
        setFinish(e.target.value)
        setInputCheck({start: inputCheck.start, finish: true, store: inputCheck.store})
    }
    function handleStoreChange(e) {
        setSelectStore(e.target.value);
        setInputCheck({start: inputCheck.start, finish: inputCheck.finish, store: true})
    }

    const select_store = stores.length?
    stores.map((s, index) =>
        <MenuItem value={s} key={index} onChange={handleStoreChange}>{ s.store_name }</MenuItem>
    ): 
        <MenuItem />

    function handleEditChange(){
        setOpen(true);
    }

    function handleSubmitDataChange(){
        // 存在するかさがす
        const exist = submitData.find((d) => {
            return (d.trainer_id === data.trainer_id && d.day == data.day);
        });
        const stimes = start.split(':');
        var start_date = new Date(data.year, data.month - 1, data.day, Number(stimes[0]), Number(stimes[1]));
        const ftimes = finish.split(':');
        var finish_date = new Date(data.year, data.month - 1, data.day, Number(ftimes[0]), Number(ftimes[1]));
        start_date  = `${start_date}`
        finish_date = `${finish_date}`
        const new_data_for_submit = {trainer_id: data.trainer_id, day: data.day, day_ja: data.day_ja, shifts: {start: start_date, finish: finish_date, trainer_id: data.trainer_id, store: selectStore}}
        if (exist){
            // すでに指定のオブジェクトが存在する場合
            const updateShiftData = submitData.filter((sd) => {
                if(sd.day == data.day && sd.trainer_id == data.trainer_id){
                    return new_data_for_submit
                }else{
                    return sd
                }
            });
            setSubmitData(updateShiftData)
        }else{
            // まだオブジェクトが存在しない場合
            submitData.push(new_data_for_submit)
        }
        setOpen(false);
        setShiftEdit(true)
    }

    return(<>
    {checked? (<>
        <TableCell onClick={handleEditChange} className="cell_box" style={{backgroundColor: '#FFDDFF', marginTop: 'auto', marginBottom: 'auto', paddingLeft: 0, paddingRight: 0}}>
            <Checkbox
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                style={{margin: 0, padding: 0}}
            />
            {/* {data.shift? (<>
                <span style={{fontSize: 8}}>{ data.shift.store.store_name}</span>
            </>):(<></>)} */}
            {selectStore? (<>
                <span style={{fontSize: 8}}>{selectStore.store_name}</span>
            </>):(<></>)}
            <div style={{marginLeft: 15, marginRight: 15, paddingTop: 10}}>
            <InputBase
                id="time"
                value={start}
                className={classes.textField}
                InputLabelProps={{ shrink: true, }}
                inputProps={{ step: 300, }}
                style={{display: 'inline-block'}}
            /><hr/>
            <InputBase
                id="time"
                value={finish}
                className={classes.textField}
                InputLabelProps={{ shrink: true, }}
                inputProps={{ step: 300, }}
                style={{display: 'inline-block'}}
            />
            </div>
        </TableCell>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">シフト詳細情報を入力してください</DialogTitle>
            <DialogContent>
                    {data.trainer.first_name_kanji} {data.trainer.last_name_kanji}さんの{data.day}日({data.day_ja})のシフトを追加
                    <hr/>
                <FormControl variant="outlined" style={{ width: '90%',textAlign: 'left',backgroundColor: 'white'}} className="select_style">
                <InputLabel id="demo-store-select-outlined-label" >店舗を選んでください。</InputLabel>
                    <Select
                    labelId="demo-store-select-outlined-label"
                    id="demo-store-select-outlined"
                    label="store"
                    onChange={ handleStoreChange }
                    defaultValue={ selectStore }
                    // value="ああああああああ"
                    >
                    { select_store }
                    </Select>
                </FormControl><br/>
                <br/>
                <TextField
                    id="time"
                    label="開始時刻"
                    type="time"
                    // defaultValue="07:30"
                    value={start}
                    className={classes.textField}
                    onChange={handleStartChange}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    style={{marginRight: 20}}
                    inputProps={{
                        step: 1800, // 5 min
                    }}
                />
                <TextField
                    id="time"
                    label="終了時刻"
                    type="time"
                    // defaultValue="07:30"
                    value={finish}
                    onChange={handleFinishChange}
                    className={classes.textField}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    inputProps={{
                        step: 1800, // 5 min
                    }}
                />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} variant="contained" color="secondary">
                キャンセル
            </Button>

            {
                (() => {
                    if (inputCheck.start && inputCheck.finish && inputCheck.store)
                        return (
                            <Button onClick={handleSubmitDataChange} variant="contained" color="primary">
                                シフト追加
                            </Button>
                        )
                    else
                    return(
                        <Button onClick={handleSubmitDataChange} variant="contained" color="primary" disabled>
                            シフト追加
                        </Button>
                    )
                })()
            }
            </DialogActions>
        </Dialog>
    </>):(<>
        <TableCell onClick={handleEditChange} className="cell_box" style={{backgroundColor: 'white', marginTop: 'auto', marginBottom: 'auto', paddingLeft: 0, paddingRight: 0}}>
            <Checkbox
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                style={{margin: 0, padding: 0}}
            />
            {data.shift? (<>
                <span style={{fontSize: 8}}>{ data.shift.store.store_name}</span>
            </>):(<></>)}
            <div style={{marginLeft: 15, marginRight: 15, paddingTop: 10}}>
                <InputBase
                    id="time"
                    type="time"
                    value={start}
                    className={classes.textField}
                    // onChange={handleStartChange}
                    InputLabelProps={{ shrink: true, }}
                    inputProps={{ step: 300, }}
                    style={{display: 'inline-block'}}
                /><hr/>
                <InputBase
                    id="time"
                    type="time"
                    value={finish}
                    className={classes.textField}
                    // onChange={handleFinishChange}
                    InputLabelProps={{ shrink: true, }}
                    inputProps={{ step: 300, }}
                    style={{display: 'inline-block'}}
                />
            </div>
        </TableCell>
    </>)}
    </>)
}