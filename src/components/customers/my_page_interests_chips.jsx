/* eslint-disable react/prop-types */
import React, {  useState, useEffect } from "react"
import Chip from '@material-ui/core/Chip';

export default function InterestChips({interests}){
    const InterestsChips = interests.length ?  
        interests.map((interest) =>
        <>
        <Chip
            key={interest.id}
            label={ interest.name }
            style={{margin: 2}}
            color="primary"
        />
        </>
    )
    : 
        <></>
    return(
        <> 
            { InterestsChips }
        </>
    )
}