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

// ????????????????????????
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
        if(data){
            if(data.shifts){
                if(data.shifts.store){
                    setSelectStore(data.shifts.store)
                }
            }
        }
    },[])
    
    const handleChange = (event) => {
        if(event.target.checked){
            setOpen(true);
        }else{
            // submitData????????????????????????
            const deletedDatas = submitData.filter((submitd) => {
                return submitd.shifts.id == data.shifts.id
            });
            console.log({???????????????????????????: deletedDatas, submitData: submitData, data: data})
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
        <MenuItem value={s} key={index}>
            { s.store_name }
        </MenuItem>
    ): 
        <MenuItem />


    function handleSubmitDataChange(){
        // ????????????????????????
        const stimes = start.split(':');
        var start_date = new Date(data.year, data.month - 1, data.day, Number(stimes[0]), Number(stimes[1]));
        const ftimes = finish.split(':');
        var finish_date = new Date(data.year, data.month - 1, data.day, Number(ftimes[0]), Number(ftimes[1]));
        start_date  = `${start_date}`
        finish_date = `${finish_date}`
        const new_data_for_submit = {trainer_id: data.trainer_id, day: data.day, day_ja: data.day_ja, 
                                    shifts: {id: data.shifts.id, start: start_date, finish: finish_date, trainer_id: data.trainer_id, store_id: selectStore.id, store: selectStore}}
        data.shifts = {id: data.shifts.id, start: start, finish: finish, trainer_id: data.trainer_id,store_id: selectStore.id, store: selectStore}
        // ?????????filter???????????????????????????????????????
        const updateShiftData = submitData.map((sd) => {
            if(sd.day == data.day && sd.trainer_id == data.trainer_id){
                console.log({new_data_for_submit: new_data_for_submit})
                return new_data_for_submit
            }else{
                console.log({sd: sd})
                return sd
            }
        });
        setSubmitData(updateShiftData)

        setOpen(false);
        // ????????????????????????(TrainerShifts)?????????????????????
        const updateTrainerShifts = trainerShifts.filter((shifts) => {
            if (shifts.trainer.id == data.trainer_id){
                const updateShiftData = shifts.data.filter((shiftd) => {
                    if(shiftd.day == data.day){
                        // ???????????????????????????????????????
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
        // ????????????????????????????????????
        setShiftEdit(true)
    }

    function handleEditChange(){
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
    data.shifts.weekend

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
                        <span style={{color: 'grey', fontSize: 10}}>{data.shifts.store.store_name}???</span>
                    </>):(<>
                        <span style={{color: 'red', fontSize: 8}}>???????????????</span>
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
                        <span style={{color: 'grey', fontSize: 10}}>{data.shifts.store.store_name}???</span>
                    </>):(<>
                        <span style={{color: 'red', fontSize: 8}}>???????????????</span>
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
                <DialogTitle id="form-dialog-title">????????????????????????????????????????????????</DialogTitle>
                <DialogContent>
                        {data.trainer.first_name_kanji} {data.trainer.last_name_kanji}?????????{data.day}???({data.day_ja})?????????????????????
                        <hr/>
                    <FormControl variant="outlined" style={{ width: '90%',textAlign: 'left',backgroundColor: 'white'}} className="select_style">
                    <InputLabel id="demo-store-select-outlined-label" >?????????????????????????????????</InputLabel>
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

                    <br/>
                    <TextField
                        id="time"
                        label="????????????"
                        type="time"
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
                        label="????????????"
                        type="time"
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
                    ???????????????
                </Button>

                <Button onClick={handleSubmitDataChange} variant="contained" color="primary" 
                    disabled={!(inputCheck.start && inputCheck.finish && inputCheck.store)} >
                    ???????????????
                </Button>

                {/* {
                    (() => {
                        if (inputCheck.start && inputCheck.finish && inputCheck.store)
                            return (
                                <Button onClick={handleSubmitDataChange} variant="contained" color="primary">
                                    ???????????????
                                </Button>
                            )
                        else
                        return(
                            <Button onClick={handleSubmitDataChange} variant="contained" color="primary" disabled>
                                ???????????????
                            </Button>
                        )
                    })()
                } */}
                </DialogActions>
            </Dialog>
        </>): (<>
            <TableCell className="cell_box" style={{backgroundColor: '#DDDDDD' ,marginTop: 'auto', marginBottom: 'auto'}}>
                <DisabledTimeCell checked={checked} handleChange={handleChange} />
            </TableCell>
        </>)}
    </>)
}