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
import NativeSelect from '@material-ui/core/NativeSelect';

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
                style={{display: 'inline-block'}}
            /><hr/>
            <InputBase
                id="time"
                type="time"
                disabled
                className={classes.textField}
                InputLabelProps={{ shrink: true, }}
                inputProps={{ step: 300, }}
                style={{display: 'inline-block'}}
            />
        {/* </TableCell> */}
    </>)
}

// 既存のシフト変更
export default function ShiftTableCellEdit({data, stores, setSubmitData, submitData, setTrainerShifts, trainerShifts, setShiftEdit, setDeleteData}){
    const classes = useStyles();
    const [selectStore, setSelectStore] = React.useState();
    const [inputCheck, setInputCheck] = React.useState({start: false, finish: false, store: false});
    const [open, setOpen] = React.useState(false);
    const [checked, setChecked] = React.useState(true);
    const [start, setStart] = React.useState();
    const [finish, setFinish] = React.useState(); 

    useEffect(()=>{
        setStart(setDate(data.shifts.start))
        setFinish(setDate(data.shifts.finish))
        setInputCheck({start: true, finish: true, store: inputCheck.store})
        //data.shifts.store
        if(data){
            if(data.shifts){
                if(data.shifts.store){
                    setSelectStore(data.shifts.store)
                }
            }
        }
    },[])
    
    const handleChange = (event) => {
        console.log({data})
        if(event.target.checked){
            console.log({data},"追加")
            setOpen(true);
        }else{
            console.log({data},"削除だよん")
            // submitDataの中にあるか確認
            const deletedDatas = submitData.filter((submitd) => {
                return submitd.shifts.id == data.shifts.id
            });
            // console.log({最初のデータか確認: deletedDatas, submitData: submitData, data: data})
            if (data.shifts.id && deletedDatas.length){
                setShiftEdit(true)
                setDeleteData((prev) => ([...prev, data.shifts.id]))
            }
        }
        setChecked(event.target.checked);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function handleStartChange(e) {
        console.log("start",e.target.value)
        setStart(e.target.value)
        setInputCheck({start: true, finish: inputCheck.finish, store: inputCheck.store})
    }
    function handleFinishChange(e) {
        console.log("finish",e.target.value)
        setFinish(e.target.value)
        setInputCheck({start: inputCheck.start, finish: true, store: inputCheck.store})
    }
    function handleStoreChange(e) {
        console.log({e}) 
        setSelectStore(e.target.value);
        setInputCheck({start: inputCheck.start, finish: inputCheck.finish, store: true})
    }
    const select_store = stores.length?
    stores.map((s, index) =>
        // <MenuItem value={s} key={index} onChange={handleStoreChange}>
        <MenuItem value={s} key={index}>
            { s.store_name }
        </MenuItem>
    ): 
        <MenuItem />

    // const option_select_store = stores.length?
    // stores.map((s, index) =>
    //     <option key={index} value={s}>{ s.store_name }</option>
    // ): 
    //     <option/>

    function handleSubmitDataChange(){
        // 存在するかさがす
        console.log({data})
        const stimes = start.split(':');
        var start_date = new Date(data.year, data.month - 1, data.day, Number(stimes[0]), Number(stimes[1]));
        const ftimes = finish.split(':');
        var finish_date = new Date(data.year, data.month - 1, data.day, Number(ftimes[0]), Number(ftimes[1]));
        start_date  = `${start_date}`
        finish_date = `${finish_date}`
        const new_data_for_submit = {trainer_id: data.trainer_id, day: data.day, day_ja: data.day_ja, 
                                    shifts: {id: data.shifts.id, start: start_date, finish: finish_date, trainer_id: data.trainer_id, store_id: selectStore.id, store: selectStore}}
        data.shifts = {id: data.shifts.id, start: start, finish: finish, trainer_id: data.trainer_id,store_id: selectStore.id, store: selectStore}
        // ここをfilterにすると上手く行かなかった
        const updateShiftData = submitData.map((sd) => {
            if(sd.day == data.day && sd.trainer_id == data.trainer_id){
                return new_data_for_submit
            }else{
                return sd
            }
        });
        setSubmitData(updateShiftData)

        setOpen(false);
        // 表示用のステート(TrainerShifts)の方も変更する
        const updateTrainerShifts = trainerShifts.filter((shifts) => {
            if (shifts.trainer.id == data.trainer_id){
                const updateShiftData = shifts.data.filter((shiftd) => {
                    if(shiftd.day == data.day){
                        // ここは変更後のデータを格納
                        return data
                    }else{
                        return shiftd
                    }
                });
                return {trainer: shifts.trainer, data: updateShiftData}
            }else{
                return shifts
            }
        });
        setTrainerShifts(updateTrainerShifts)
        // シフトの変更をここで検出
        setShiftEdit(true)
    }

    function handleEditChange(){
        console.log({data})
        setOpen(true);
    }
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
        {checked? (<>
        {open? (
            <TableCell onClick={handleEditChange} className="cell_box" style={{backgroundColor: '#64e8e8', marginTop: 'auto', marginBottom: 'auto', paddingLeft: 0, paddingRight: 0}}>
                <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    style={{margin: 0, padding: 0}}
                />
                {data.shifts?(<>
                    {data.shifts.store?(<>
                        <span style={{color: 'grey', fontSize: 10}}>{data.shifts.store.store_name}店</span>
                    </>):(<>
                        <span style={{color: 'red', fontSize: 8}}>店舗未選択</span>
                    </>)}
                </>):(<></>)}
                <div style={{marginLeft: 15, marginRight: 15, paddingTop: 10, width: 80}}>
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
        ):(
            <TableCell onClick={handleEditChange} className="cell_box" style={{backgroundColor: '#CCFFFF', marginTop: 'auto', marginBottom: 'auto', paddingLeft: 0, paddingRight: 0}}>
                <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    style={{margin: 0, padding: 0}}
                />
                {data.shifts?(<>
                    {data.shifts.store?(<>
                        <span style={{color: 'grey', fontSize: 10}}>{data.shifts.store.store_name}店</span>
                    </>):(<>
                        <span style={{color: 'red', fontSize: 8}}>店舗未選択</span>
                    </>)}
                </>):(<></>)}
                <div style={{marginLeft: 15, marginRight: 15, paddingTop: 10, width: 80}}>
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
        )}
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
                            defaultValue={ data.shifts.store }
                        >
                            { select_store }
                        </Select>
                    </FormControl><br/>

                    {/* <FormControl variant="outlined" style={{ width: '90%',textAlign: 'left',backgroundColor: 'white', marginBottom: 20}} className="select_style">
                        <InputLabel id="demo-store-select-outlined-label" >店舗を選んでください。</InputLabel>
                        <NativeSelect
                            onChange={ handleStoreChange }
                            defaultValue={ data.shifts.store }
                        >
                            { option_select_store }
                        </NativeSelect>
                    </FormControl><br/> */}


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
        </>): (<>
            <TableCell className="cell_box" style={{backgroundColor: '#DDDDDD' ,marginTop: 'auto', marginBottom: 'auto'}}>
                <DisabledTimeCell checked={checked} handleChange={handleChange} />
            </TableCell>
        </>)}
    </>)
}