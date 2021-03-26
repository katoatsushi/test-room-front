// import {React, useEffect} from 'react';
import React, { useEffect, useState ,useCallback} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';

export default function BirthDay(props) {
  const [year, setYear] = React.useState(1990);
  const [month, setMonth] = React.useState(6);
  const [day, setDay] = React.useState(1);
  const [yearOpen, setYearOpen] = React.useState(false);
  const [monthOpen, setMonthOpen] = React.useState(false);
  const [dayOpen, setDayOpen] = React.useState(false);

  useEffect(()=>{
    const date = new Date(year, month - 1, day).toLocaleString({ timeZone: 'Asia/Tokyo' });
    props.setCustomerInfo((prev) => ({...prev, birthday: date}))
  },[year, month, day])

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };
  const handleYearClose = () => {
    setYearOpen(false);
  };
  const handleYearOpen = () => {
    setYearOpen(true);
  };
  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };
  const handleMonthClose = () => {
    setMonthOpen(false);
  };
  const handleMonthOpen = () => {
    setMonthOpen(true);
  };
    const handleDayChange = (event) => {
    setDay(event.target.value);
  };
  const handleDayClose = () => {
    setDayOpen(false);
  };
  const handleDayOpen = () => {
    setDayOpen(true);
  };


  const today =  new Date
  const this_yaer = today.getFullYear()
  const old_year =  today.getFullYear() - 100
  const years = [...Array(100)].map((_, i) => i + old_year)
  const months = [...Array(12)].map((_, i) => i + 1)
  const month_a = [1,3,5,7,8,10,12]
  let days = [...Array(31)].map((_, i) => i + 1)
  if(month_a.indexOf(month) != -1){
    days = [...Array(31)].map((_, i) => i + 1)
  }else if(month == 2&&year%4 == 0){
    days = [...Array(28)].map((_, i) => i + 1)
  }else{
    days = [...Array(30)].map((_, i) => i + 1)
  }

  const years_box =  years.map((year,index) =>
    <MenuItem value={year}>{year}</MenuItem>
  );
  const months_box =  months.map((month,index) =>
    <MenuItem value={month}>{month}</MenuItem>
  );
  const days_box = days.map((day,index) =>
    <MenuItem value={day}>{day}</MenuItem>
  );
  return (
    <div style={{margin: 'auto 0', textAlign: 'center'}}>
    <div className="customer_info_tag">生年月日を教えてください</div>
      <FormControl>
        <InputLabel id="demo-controlled-open-select-label">年</InputLabel>
        <Select
          defaultValue = { 1990 }
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={yearOpen}
          onClose={handleYearClose}
          onOpen={handleYearOpen}
          // value={year}
          onChange={handleYearChange}
        >
          { years_box }
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="demo-controlled-open-select-label">月</InputLabel>
        <Select
          defaultValue = { 6 }
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={monthOpen}
          onClose={handleMonthClose}
          onOpen={handleMonthOpen}
          // value={month}
          onChange={handleMonthChange}
        >
          { months_box }
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="demo-controlled-open-select-label">日</InputLabel>
        <Select
          defaultValue = { 15 }
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={dayOpen}
          onClose={handleDayClose}
          onOpen={handleDayOpen}
          value={day}
          onChange={handleDayChange}
        >
          { days_box }
        </Select>
      </FormControl>
    </div>
  );
}