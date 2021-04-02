/* eslint-disable react/prop-types */
import React, { useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import axios from 'axios'

function ShowAllSchedules(props){
    const showVacancy = props.vacancy ?  
    props.vacancy.map((obj) =>
    <>
        【{obj.store.store_name}】<br/>
        { obj.schedule.map((sch) => 
        <>
        {
            (() => {
                if (sch.vacancy_count==0) {
                    return(<></>);
                } else {
                    return (
                        <>{sch.times[0][0]}:{sch.times[0][1]}〜{sch.times[1][0]}:{sch.times[1][1]}<br/></>
                    );
                }
            })()
        }

        </>) }
    </>
    ): <>現在予約可能なスケジュールありません</>   
    return (
        <div>
            {showVacancy}
        </div>
    )
}

function SelectStore(props){
    const stores_box = props.allStores.length ?  
        props.allStores.map((store,store_index) =>
            <MenuItem  value={store} key={store_index}>{ store.store_name }</MenuItem>
        ): 
            <MenuItem />
    function handlehange(e) {
        const res = props.vacancy.filter((vac) => {
            return vac.store.id === e.target.value.id;
        });
        props.setSelectVacancy((prev)=> (prev, res[0]))
        props.setSelectStore((prev)=> (prev, e.target.value))
        props.setSelectTime((prev)=> (prev, []))
        props.setTimesOpen((prev)=> (prev, true))
    }
    return (
        <div style={{textAlign: 'center'}}>
            <FormControl variant="outlined" style={{ width: '90%'}} className="select_style">
              <InputLabel id="demo-store-select-outlined-label" >店舗を選んでください</InputLabel>
                <Select
                  labelId="demo-store-select-outlined-label"
                  id="demo-store-select-outlined"
                  label="store"
                  onChange={ handlehange }
                  style={{ backgroundColor: 'white'}}
                >
                  { stores_box }
                </Select>
            </FormControl> <br/><br/>
        </div>
    )
}

function ShowSchedule(props){
    function handleChenge(e){
        props.setSelectTime((prev) => (prev, e));
    }
    const radio_buttons = props.selectVacancy.schedule ?  
    props.selectVacancy.schedule.map((time) =>
    <>
        {
            (() => {
                if (time.vacancy_count==0) {
                    return(
                    <FormControlLabel 
                        control={<Radio />} 
                        disabled
                        label= {time.times[0][0] + "時"+ time.times[0][1] + "分" + " 〜 " + time.times[1][0] + "時" + time.times[1][1] + "分"} 
                    />
                    );
                } else {
                    return (
                        <FormControlLabel 
                            value={ time.times[0][0] + "時"+ time.times[0][1] + "分" + " 〜 " + time.times[1][0] + "時" + time.times[1][1] + "分"}
                            onClick={() => handleChenge(time.times)}
                            control={<Radio />} 
                            label= {time.times[0][0] + "時"+ time.times[0][1] + "分" + " 〜 " + time.times[1][0] + "時" + time.times[1][1] + "分"} 
                        />
                    );
                }
            })()
        }

    </>
    ): <></>

    function handleClose(){
        props.setOpen((prev)=>(prev, false))
    }
    function handleSubmit() {
        const url = `/evaluations`
        axios.post( url, {
            time: props.selectTime,
          })
          .then(function (response) {
              console.log(response)
          })
          .catch(function (response) {
            console.log(response.data);
          })
    }

    return(
        <>
        {props.timesOpen?(
        <div style={{textAlign: 'center'}}>
            <FormLabel component="legend">日時を選択してください</FormLabel>
            <div className="chose_time">
                <FormControl component="fieldset">
                    <RadioGroup aria-label="gender" name="gender1"> 
                        { radio_buttons }
                    </RadioGroup>
                </FormControl>
            </div>
            <Button variant="contained" size='large' onClick={handleClose} color="primary" href="/">キャンセル</Button>
            <Button variant="contained" size='large' onClick={handleSubmit} color="secondary" >予約する</Button>
        </div>
        ):(
            <></>
        )
        }
        </>

    );
}

export default function RoomPlusBox(){
    const today = new Date
    const [vacancy, setVacancy] = useState([]);
    const [allStores, setAllStores] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [selectStore, setSelectStore] = useState({});
    const [selectVacancy, setSelectVacancy] = useState({});
    const [selectTime, setSelectTime] = useState([]);
    const [open ,setOpen] = useState(false);
    const [timesOpen ,setTimesOpen] = useState(false);
    const company_id = 1
    const customer_menu_id = 1
    const url = `/appointments/vacancy/${company_id}/${customer_menu_id}/${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
    useEffect(()=>{
        axios.get(url)
        .then(function(res) {
            setVacancy(res.data.data);
            setAllStores(res.data.stores);
        })
        .catch(function(error) {
            console.log({error})
        });
    },[])   
    function handleOpen(){
        setOpen(true);
    }

    console.log({selectTime})
    return(
        <>
        {open?(
            <>
            <SelectStore setTimesOpen={setTimesOpen} vacancy={vacancy} allStores={allStores} setSelectTime={setSelectTime} setSelectStore={setSelectStore} setSelectVacancy={setSelectVacancy}/>
            <ShowSchedule timesOpen={timesOpen} setOpen={setOpen} selectTime={selectTime} setSelectTime={setSelectTime} setSelectVacancy={setSelectVacancy} selectVacancy={selectVacancy}/>
            </>
        ):(
            <>        
            <span>本日の空き状況です</span>
            <div style={{overflow: 'scroll', height: 120, backgroundColor: 'white', padding: 20}}>
                <ShowAllSchedules vacancy={vacancy}/>
            </div>
            {vacancy? (
                <Button variant="contained" color="primary" onClick={handleOpen} style={{marginLeft: '0 0 0 auto',  float: 'right'}}>
                    Roomプラスを予約する
                </Button>
            ):(
                <Button variant="contained" color="primary" disabled onClick={handleOpen} style={{marginLeft: '0 0 0 auto',  float: 'right'}}>
                    Roomプラスを予約する
                </Button>
            )}
            </>
            )
        }
        </>
    )
}