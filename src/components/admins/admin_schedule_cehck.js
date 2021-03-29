import React, { useEffect, useState ,useCallback} from 'react';
import Button from '@material-ui/core/Button' 
import axios from 'axios'
import { BrowserRouter as Router, Route, Switch, useParams, useHistory, useLocation, } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, green } from '@material-ui/core/colors';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Grid from '@material-ui/core/Grid';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

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

export default function ScheduleCheck({company_id,  day, scroll}) {
    const classes = useStyles();
    const history = useHistory();
    const [storeAppointments, setStoreAppointments] = useState([]);
    const [thisStoreAppointments, setThisStoreAppointments] = useState();
    var url = `/admin/company_id/${company_id}/year/${day.year}/month/${day.month}/day/${day.day}`
    useEffect(()=>{
        axios.get(url)
        .then(function(res) {
            setStoreAppointments(res.data.today_schedules);
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

    function handlehange(e) {
        setThisStoreAppointments(e.target.value.value);
    }

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
    
    const StyledTableRow = withStyles((theme) => ({
        root: {
            '&:nth-of-type(odd)': {
            },
        },
    }))(TableRow);

    const stores_box = storeAppointments.length ?  
    storeAppointments.map((store,store_index) =>
        <MenuItem  value={store} key={store_index}>{ store.store_name }</MenuItem>
    ): 
        <MenuItem />

    const render_rooms = thisStoreAppointments ?  
       thisStoreAppointments.store_rooms_num_for_js.map((room, index) =>
            <StyledTableCell align="center" key={index} >{ room }</StyledTableCell>
        )
    : 
        <MenuItem />

    const render_appoints = thisStoreAppointments?  
       thisStoreAppointments.schedules.map((schedule, index) =>
       <>
          <StyledTableRow key={index}>
            <StyledTableCell key={index} align="center" style={{fontSize: '1.0em', backgroundColor: '#DDFFFF'}}>
              {schedule[0][0][0] + ":" + schedule[0][0][1]}<br/>
                |<br/>
              {schedule[0][1][0] + ":" + schedule[0][1][1]}
            </StyledTableCell>
            { ScheduleDetails(schedule[1], schedule[0]) }
          </StyledTableRow>
        </>
        )
    : 
        <MenuItem />

    function handleClickOpen(res,time) {
      const next_url = `/customer/${ res.customer_id }/appointment/${ res.id }/new_record`
      history.push({ pathname: next_url, state: { response: res, time: time }});
    }


    function ScheduleDetails(res,time) {
      var blank_cells = [];
      function FillBlankRepeat() {
        var items = [];
        for (var i = 0;  i < thisStoreAppointments.store_rooms_num - res.length;  i++  ) {
            items.push(i);
        }
        return {items};
      }
      const repeat_materials = FillBlankRepeat()
       return (
          <>

            {res.map((r,index) => (
              <>
              {
                (() => {
                  if (r.customer_id) {
                    return(<>
                      <StyledTableCell key={index} align="center" onClick={() => handleClickOpen(r, time)} style={{fontSize: '0.9em',border: '1px solid', borderColor: '#DDDDDD'}}>
                        <Grid container spacing={3}>
                          <Grid item xs={3} sm={2}>
                          {r.avatar_url? (
                            <Avatar variant="rounded" style={{marginLeft: 'auto'}} src={r.avatar_url} className={classes.rounded}/>
                          ):(
                            <Avatar variant="rounded" style={{marginLeft: 'auto'}} className={classes.rounded}/>
                          )}
                          </Grid>
                          <Grid item xs={9} sm={9} style={{textAlign: 'left'}}>
                            {r.first_name_kana} {r.last_name_kana}<br/>
                            {r.first_name_kanji} {r.last_name_kanji}様/
                            {r.fitness_name}
                          </Grid>
                        </Grid>
                      </StyledTableCell>
                    </>);
                  } else {
                    if (r.name) {
                      return (
                        <StyledTableCell key={index} align="center" style={{fontSize: '0.9em', backgroundColor: '#FF97C2',border: '1px solid', borderColor: '#DDDDDD'}}>
                          お名前:{r.name}<br/>
                          メールアドレス:{r.email}
                        </StyledTableCell>
                      )
                    } else {
                      return (
                        <StyledTableCell key={index} align="center" style={{fontSize: '0.9em', backgroundColor: '#FFBEDA',border: '1px solid', borderColor: '#DDDDDD'}}/>
                      )
                    }
                  }
                })()
              }
              </>
            ))}
            {repeat_materials.items.map((mate, index) => (
              <StyledTableCell style={{backgroundColor: 'white', border: '1px solid', borderColor: '#DDDDDD'}}/>
            ))}
          </>
       )
    }
    return (
        <>
        <br/>
          <div style={{textAlign: 'center'}}>
            <FormControl variant="outlined" style={{ width: '90%'}} className="select_style">
              <InputLabel id="demo-store-select-outlined-label" >店舗を選んでください</InputLabel>
                <Select
                  labelId="demo-store-select-outlined-label"
                  id="demo-store-select-outlined"
                  label="store"
                  onChange={ handlehange }
                  // defaultValue={thisStoreAppointments ?  thisStoreAppointments.store_name : null}
                  style={{ backgroundColor: 'white'}}
                >
                  { stores_box }
                </Select>
            </FormControl> <br/><br/>
          </div>
          {scroll?(
            <div style={{height: 500, overflow: 'auto'}}>
              <TableContainer component={Paper} className="inline_block">
                  <Table aria-label="customized table" className="inline_block">
                      <TableHead>
                          <TableRow>
                              <StyledTableCell align="center">時間</StyledTableCell>
                              { render_rooms } 
                          </TableRow>
                      </TableHead>
                     
                      <TableBody>
                          { render_appoints } 
                      </TableBody>
                  </Table>
              </TableContainer>
            </div>
          ) : (
            <div>
              <TableContainer component={Paper} className="inline_block">
                  <Table aria-label="customized table" className="inline_block">
                      <TableHead>
                          <TableRow>
                              <StyledTableCell align="center">時間</StyledTableCell>
                              { render_rooms } 
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          { render_appoints } 
                      </TableBody>
                  </Table>
              </TableContainer>
            </div>
          )}
        </>
    )
}
