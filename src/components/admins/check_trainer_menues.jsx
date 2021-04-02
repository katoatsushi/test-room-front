/* eslint-disable react/prop-types */
import React  from 'react';
import Chip from '@material-ui/core/Chip';

function CheckMenu(props){
    const [value, setValue] = React.useState(false) 

    function handleValueChange(){
        if(value){
            //削除
            const deletedIDs = props.trainerMenues.filter((m) => {
                return m.name != props.menu.name;
            });
            props.setTrainerMenues(deletedIDs)
        }else{
            // 追加
            const newIDs =  props.trainerMenues.splice(-1, 0, props.menu);
            props.setTrainerMenues((prev) => [...prev, ...newIDs])
        }
        setValue(!value);
    }
    return(
        <>
        {
            value?
            (<Chip
                key={props.menu.id}
                label={ props.menu.name }
                clickable
                color="primary"
                onClick={ handleValueChange }
                style={{margin: 8}}
            />)
            :
            (<Chip
                key={props.menu.id}
                label={ props.menu.name }
                clickable
                color="primary"
                variant="outlined"
                style={{backgroundColor: 'white',margin: 8}}
                onClick={ handleValueChange }
            />)
        }
        </>
    );
}

export default function CheckTrainerMenues(props){
    return(
        <>
          {props.allFitnesses.map((menu, index) => (
                <>
                    <CheckMenu menu={menu} key={index} trainerMenues={props.trainerMenues} setTrainerMenues={props.setTrainerMenues}/>
                </>
            ))}
        </>
    )
}