import React , { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { useForm } from "react-hook-form";
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Route, Switch, useParams, useHistory, useLocation, } from 'react-router-dom';
import { selectCurrentAdmin, selectAdminHeaders, adminRemove, } from '../slices/admin';
import { selectCurrentTrainer, selectTrainerHeaders, trainerRemove, } from '../slices/trainer';
import { selectCurrentCustomer, selectCustomerHeaders, customerRemove, } from '../slices/customer';
import RoomPlusBox from './customers/room_plus'
import ShiftNew  from './trainers/shifts/shift_new';

export default function Root() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const admin_headers = useSelector(selectAdminHeaders);
  const currentTrainer = useSelector(selectCurrentTrainer);
  const trainer_headers = useSelector(selectTrainerHeaders);
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customer_headers = useSelector(selectCustomerHeaders);
  const today = new Date()
  return (
    <Container component="main" maxWidth="xs">
      {currentTrainer? (
        <ShiftNew year={today.getFullYear()} month={today.getMonth()} />
      ):(<></>)}
      {currentCustomer? (
        <RoomPlusBox/>
      ):(<></>)}

      <h1>This is Root Page</h1>
         {currentAdmin?.id ? (
              <div>企業ID:{currentAdmin.company_id}</div>
            ) : (
              <>
              </>
            )}
    </Container>
  );
}