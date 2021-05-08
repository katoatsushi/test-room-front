/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useHistory} from 'react-router-dom';
import Button from '@material-ui/core/Button'
import { useForm } from "react-hook-form";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const SelectDate = (props) => {
    const today = new Date
    const store_id = props.match.params.store_id
    const customer_menu_id = props.match.params.customer_menu_id
    const [value, onChange] = useState(new Date());
    const history = useHistory();
    const onSubmit = (data) => console.log(data);
    const { handleSubmit } = useForm();


    return (
        <>
        <br />
        <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{textAlign: 'center', marginTop: 100}}>
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
                    disabled ={ !(value > today) }
                    onClick = {() => 
                        history.push({
                            pathname: [`/customer/${props.match.params.customer_id}/appointments/new/${store_id}/${customer_menu_id}/${value.getFullYear()}/${value.getMonth() + 1}/${value.getDate()}`],
                            state: props.location.state})}
                >
                    時間を選ぶ
                </Button>

            </div>

        </form>
    </>
    );
  };

export default SelectDate;


