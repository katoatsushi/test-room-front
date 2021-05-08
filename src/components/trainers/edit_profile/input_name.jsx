/* eslint-disable react/prop-types */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

export default function InputName(props) {
    function handleName_A(e){
        props.setTrainerInfo((prev) =>  ({...prev, name: {
                    first_name_kanji: e.target.value, 
                    last_name_kanji:  prev.name.last_name_kanji,
                    first_name_kana: prev.name.first_name_kana,
                    last_name_kana: prev.name.last_name_kana
                }}))
    }
    function handleName_B(e){
        props.setTrainerInfo((prev) =>  ({...prev, name: {
                    first_name_kanji: prev.name.first_name_kanji,
                    last_name_kanji:  e.target.value,
                    first_name_kana: prev.name.first_name_kana,
                    last_name_kana: prev.name.last_name_kana
                }}))
    }
    function handleName_C(e){
        props.setTrainerInfo((prev) =>  ({...prev, name: {
                    first_name_kanji: prev.name.first_name_kanji,
                    last_name_kanji:  prev.name.last_name_kanji,
                    first_name_kana: e.target.value,
                    last_name_kana: prev.name.last_name_kana
                }}))
    }
    function handleName_D(e){
        props.setTrainerInfo((prev) =>  ({...prev, name: {
                    first_name_kanji: prev.name.first_name_kanji,
                    last_name_kanji:  prev.name.last_name_kanji,
                    first_name_kana: prev.name.first_name_kana,
                    last_name_kana: e.target.value
                }}))
    }
    return(<>
        <div className="trainer_name_input_label">お名前を入力してください</div>
        <Grid container spacing={3} style={{fontWeight: 500,overflowWrap: 'break-word', paddingLeft: 10, paddingRight: 10, marginBottom: 50}}>
            <Grid item xs={6} style={{marginTop: 'auto', marginBottom: 'auto'}}>
                <TextField id="outlined-basic" onChange={handleName_A} label="姓" variant="outlined" style={{ backgroundColor: 'white'}}/>
            </Grid>
            <Grid item xs={6} style={{marginTop: 'auto', marginBottom: 'auto'}}>
                <TextField id="outlined-basic" onChange={handleName_B }label="名" variant="outlined" style={{ backgroundColor: 'white'}}/>
            </Grid>
            <Grid item xs={6} style={{marginTop: 'auto', marginBottom: 'auto'}}>
                <TextField id="outlined-basic" onChange={handleName_C} label="せい" variant="outlined" style={{ backgroundColor: 'white'}}/>
            </Grid>
            <Grid item xs={6} style={{marginTop: 'auto', marginBottom: 'auto'}}>
                <TextField id="outlined-basic" onChange={handleName_D}  label="めい" variant="outlined" style={{ backgroundColor: 'white'}}/>
            </Grid>
        </Grid>
    </>)
}