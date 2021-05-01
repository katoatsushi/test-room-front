/* eslint-disable react/prop-types */
import React from 'react';
// import ScheduleCheck from '../../admins/admin_schedule_cehck'
import ScheduleShow from './schedule_show'
import Paper from '@material-ui/core/Paper';
import {selectCurrentAdmin} from '../../../slices/admin'
import {selectCurrentTrainer} from '../../../slices/trainer'
import { useSelector } from 'react-redux';

export default function AdminScheduleCheck(props){
    const currentAdmin = useSelector(selectCurrentAdmin);
    const currentTrainer = useSelector(selectCurrentTrainer);
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
                            <Paper style={{textAlign: 'center', padding: 10}}>
                                {day_info.month}月{day_info.day}日のスケジュール
                            </Paper>
                            {/* <ScheduleCheck company_id={company_id} day={day_info}/> */}
                            <ScheduleShow company_id={company_id} day={day_info} />
                        </>
                    );
                } else if (currentTrainer) {
                    const company_id = currentTrainer.company_id
                    return (
                        <>
                            <Paper style={{textAlign: 'center', padding: 10}}>
                                {day_info.month}月{day_info.day}日のスケジュール
                            </Paper>
                            {/* <ScheduleCheck company_id={company_id} day={day_info}/> */}
                            <ScheduleShow company_id={company_id} day={day_info} />
                        </>
                    );
                }
                })()
            }
        </>
    )
}