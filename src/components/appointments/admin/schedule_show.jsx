/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, green } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { useSelector } from 'react-redux';
import { selectCurrentTrainer, selectTrainerHeaders } from '../../../slices/trainer';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  square: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  rounded: {
    color: '#fff',
    backgroundColor: green[500],
  },
}));

export default function ScheduleShow({company_id,  day, scroll}) {
    const classes = useStyles();
    const history = useHistory();
    const currentTrainer = useSelector(selectCurrentTrainer);
    const [storeAppointments, setStoreAppointments] = useState([]);
    const [stores, setStores] = useState([]);
    const [thisStoreAppointments, setThisStoreAppointments] = useState();
    const [thisStores, setThisStores] = useState();
    // var url = `/admin/company_id/${company_id}/year/${day.year}/month/${day.month}/day/${day.day}`
    var url = `/admin/date_schedule/company_id/${company_id}/year/${day.year}/month/${day.month}/day/${day.day}`
    
    useEffect(()=>{
        axios.get(url)
        .then(function(res) {
            setStoreAppointments(res.data.schedules);
            setStores(res.data.stores)
            console.log({これどう: res.data.stores[0].store_name})
            setThisStores(res.data.stores[0].store_name)
            // 初期のスケージュール
            setThisStoreAppointments(res.data.schedules[0].data)
            console.log({スケジュール: res.data.schedules[0].data})
            if (res.data.today_schedules.length){
              // 初期値を設定
              console.log({res})
              setThisStoreAppointments(res.data.today_schedules[0].value);
            }
        })
        .catch(function(error) {
          console.log({error})
        });
    },[day])

    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: '#4DA7F0',
            color: theme.palette.common.white,
            fontWeight: 600
        },
        body: {
            fontSize: 20,
            padding: 5,
        },
    }))(TableCell);
    
    const StyledTableRow = withStyles(() => ({
        root: {
            '&:nth-of-type(odd)': {
            },
        },
    }))(TableRow);

    const stores_box = stores.length ?  
    stores.map((store,index) =>
        <MenuItem value={ store.store_name }  onChange={ handlehange } key={index}>{ store.store_name }</MenuItem>
    ): 
        <MenuItem />
    function handlehange(e) {
        // setStores(e.target.value.store_name);
        setThisStores(e.target.value);
        const selectAppointment = storeAppointments.filter((apo, index) => {
            return apo.name == e.target.value
        });
        console.log({テスト: selectAppointment[0]})
        setThisStoreAppointments(selectAppointment[0].data)
    }
    function timeChange(a) {
        const start = new Date(a[0])
        const finish = new Date(a[1])
        return(<>
            {start.getHours()}:{start.getMinutes()}<br/>
            ｜<br/>
            {finish.getHours()}:{finish.getMinutes()}
        </>)
    }

    function SearchTrialCustomer(e){
        console.log({e})
        return(<></>)
    }

    const schedule_cells = thisStoreAppointments ?  
        thisStoreAppointments.map((apos,index) => (<>
            <TableRow key={index}>
            {apos.map((a) => (<>
                {a? (<>
                    {a.length?(<>
                        <StyledTableCell component="th" scope="row"
                            align="center" style={{fontSize: '0.9em',border: '1px solid', borderColor: '#DDDDDD', width: '15%'}}
                        >   
                            { timeChange(a) }
                        </StyledTableCell>
                    </>):(<>
                    {a.appointment_time?(<>
                        <StyledTableCell component="th" scope="row"
                                style={{fontSize: '0.6em',border: '1px solid', borderColor: '#DDDDDD',backgroundColor: '#AEFFBD'}}
                        >
                            {a.fitness_name}<br/>
                            {a.first_name_kanji}{a.last_name_kanji}様
                        </StyledTableCell>
                    </>):
                    (<>{a.customer_service?(<>
                        <StyledTableCell component="th" scope="row"
                            style={{fontSize: '0.6em',border: '1px solid', borderColor: '#DDDDDD', backgroundColor: '#FFDDFF'}}
                        >
                            体験予約のお客様<br/>
                            {a.name}様<br/>
                            {a.tel}/{a.email}/{a.detail}
                            {SearchTrialCustomer(a)}
                        </StyledTableCell>
                    </>):(<>
                        <StyledTableCell component="th" scope="row"
                            style={{fontSize: '0.6em',border: '1px solid', borderColor: '#DDDDDD', backgroundColor: '#FFDDFF'}}
                        >
                            管理者予定あり
                        </StyledTableCell>
                    </>)}
                    </>)}
                    </>)}
                </>) : (<>
                    <StyledTableCell component="th" scope="row"
                        style={{fontSize: '0.9em',border: '1px solid', borderColor: '#DDDDDD'}}
                    >
                        {/* nil */}
                    </StyledTableCell>
                </>)
                }
            </>))}
            </TableRow>
        </>)
    ): 
        <MenuItem />

    return (
        <>
        <br/>
          <div style={{textAlign: 'center'}}>
            {thisStores? (<>
            <FormControl variant="outlined" style={{ width: '90%'}} className="select_style">
              <InputLabel id="demo-store-select-outlined-label" >店舗を選んでください</InputLabel>
                <Select
                  labelId="demo-store-select-outlined-label"
                  id="demo-store-select-outlined"
                  label="store"
                  value={thisStores}
                  onChange={ handlehange }
                  // defaultValue={thisStoreAppointments ?  thisStoreAppointments.store_name : null}
                  style={{ backgroundColor: 'white'}}
                >
                  { stores_box }
                </Select>
            </FormControl> <br/><br/>
            </>):(<></>)
            }
          </div>

            <div>
              <TableContainer component={Paper} className="inline_block">
                <div className="schedule_tag">時間</div>
                  <Table aria-label="customized table" className="inline_block">
                      <TableHead>
                          <TableRow>
                              {/* <StyledTableCell align="center">時間</StyledTableCell> */}
                          </TableRow>
                      </TableHead>
                      <TableBody>
                        { schedule_cells }
                      </TableBody>
                  </Table>
              </TableContainer>
            </div>
        </>
    )
}
