/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useHistory} from 'react-router-dom';
import Button from '@material-ui/core/Button'
import { useForm } from "react-hook-form";
import Calendar from 'react-calendar';
import { useSelector } from 'react-redux';
import 'react-calendar/dist/Calendar.css';
import {selectCurrentAdmin} from '../../../slices/admin'
import {selectCurrentTrainer} from '../../../slices/trainer'

const AdminSelectDate = () => {
    const currentAdmin = useSelector(selectCurrentAdmin);
    const currentTrainer = useSelector(selectCurrentTrainer);
    const [value, onChange] = useState(new Date());
    const history = useHistory();
    const onSubmit = (data) => console.log(data);
    const { handleSubmit } = useForm();

    return (
        <>
        <br />
        <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{backgroundColor: 'white',textAlign: 'center', padding: 10 }}>予約状況を確認</div>
            <div style={{textAlign: 'center', marginTop: 80}}>
                <Calendar
                    locale="ja-JP"
                    onChange={onChange}
                    value={value}
                    className="calendar"
                />
                <Button 
                    variant="contained" 
                    size='large' 
                    color="secondary"
                    style={{width: '95%', marginTop: 30, marginRight: 'auto', marginLeft: 'auto'}}
                    onClick = {() => history.push(`/admin/schedule/check/year/${value.getFullYear()}/month/${value.getMonth() + 1}/day/${value.getDate()}`)} 
                >
                    時間を選ぶ
                </Button>

            </div>

        </form>
    </>
    );
  };

export default AdminSelectDate;


