/* eslint-disable react/prop-types */
import React from 'react';
import Paper from '@material-ui/core/Paper';
import {selectCurrentAdmin} from '../../slices/admin'
import {selectCurrentTrainer} from '../../slices/trainer'
import { useSelector } from 'react-redux';
import ScheduleShow from '../appointments/admin/schedule_show'

export default function AdminTop(props){
    const currentAdmin = useSelector(selectCurrentAdmin);
    const currentTrainer = useSelector(selectCurrentTrainer);
    console.log("AdminTop", {props})
    const params = props.match.params
    const day_info = {year: params.year, month: params.month, day: params.day}

    return (
        <>
            {
                (() => {
                if (currentAdmin) {
                    const company_id = currentAdmin.company_id
                    return(
                        <>
                            <Paper style={{textAlign: 'center', padding: 10}}>本日のスケジュール</Paper>
                            <ScheduleShow company_id={company_id}  day={day_info} scroll={null} />
                        </>
                    );
                } else if (currentTrainer) {
                    const company_id = currentTrainer.company_id
                    return (
                        <>
                            <Paper style={{textAlign: 'center', padding: 10}}>本日のスケジュール</Paper>
                            <ScheduleShow company_id={company_id}  day={day_info} scroll={null} />
                        </>
                    );
                }
                })()
            }
        </>
    )
}