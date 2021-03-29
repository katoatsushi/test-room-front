import React, { useEffect, useState, Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { useForm } from "react-hook-form";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams,
    useHistory,
    useLocation,
  } from 'react-router-dom';
import { Link } from 'react-router-dom'

const MasterAdminTop = (props) => {
    const history = useHistory();
    const [companies, setCompanies] = useState([]);
    useEffect(()=>{
        const url = `/companies`

        axios.get(url)
        .then(function(res) {
            setCompanies(res.data);
        })
        .catch(function(error) {
            console.log({error})
        });
        
    },[])
    console.log(companies)

    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);
    
    const StyledTableRow = withStyles((theme) => ({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }))(TableRow);

   
    console.log(companies)
    const readCompanies = companies.length ?  
        companies.map((company ,companies_index) =>
            <StyledTableRow key={ company[0].id } >
                {/* <StyledTableCell align="center">{company[0].id}</StyledTableCell> */}
                <StyledTableCell align="center">
                    <Link to={`/company/${company[0].id}`}> 
                            { company[0].name }
                    </Link>
                </StyledTableCell>
                <StyledTableCell align="center"> { company[0].address }</StyledTableCell>
                <StyledTableCell align="center"> { company[0].tel }</StyledTableCell>
                <StyledTableCell align="center">
                    { readAdmins(company[1]) }
                </StyledTableCell>
                <StyledTableCell align="center">
                    {/* <Button variant="outlined" color="primary">
                        <Link to={`/company/${company[0].id}`}>  { company[0].name } </Link>
                    </Button> */}
                <Button 
                    variant="contained" 
                    size='large' 
                    color="secondary" 
                    onClick={() => history.push(`/${ company[0].id }/admin/sign_up`)}>
                   { company[0].name }の管理者を追加
                </Button>

                </StyledTableCell>
            </StyledTableRow>
        )
    : 
        <></>
    function readAdmins(admins){
        return admins.map((admin,index) =>
            <>
                { admin.email }
            </>
        );
    }

    return (
        <>
            <TableContainer>
                <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        {/* <StyledTableCell align="center">ID</StyledTableCell> */}
                        <StyledTableCell align="center">会社名</StyledTableCell>
                        <StyledTableCell align="center">住所</StyledTableCell>
                        <StyledTableCell align="center">電話番号</StyledTableCell>
                        <StyledTableCell align="center">管理者</StyledTableCell>
                        <StyledTableCell align="center">管理者登録</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { readCompanies }
                    </TableBody>
                </Table>
            </TableContainer>
            会社を新規発行<br/>
            <Fab  color="secondary" aria-label="add" href="/company/new"><AddIcon /></Fab>  
        </>
    );
};
  
export default MasterAdminTop;