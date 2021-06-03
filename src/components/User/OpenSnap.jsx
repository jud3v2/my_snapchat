import React from 'react';
import {Dimensions} from "react-native";
import Image from "../Image/Image";

export default function OpenSnap(props){

    const height = Dimensions.get('window').height;
    const width = Dimensions.get('window').width;

    return (
        <Image source={props.image} style={{width: width, height: height}}/>
    )
}