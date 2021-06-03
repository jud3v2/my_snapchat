import React from 'react';
import {View,Text,TouchableOpacity ,StyleSheet} from 'react-native';
import  Icon  from 'react-native-vector-icons/Ionicons';
import OpenSnap from "./OpenSnap";
import axios from 'axios';
import config from '../../config';
import {showMessage} from "react-native-flash-message";

const MessageReceived = (props)=>{
    console.log(props.snapId)
    const openSnap = () => {
        axios.get(config.urlApi + 'snap/' + props.snapId)
            .then(res => {
                console.log(res)
                return <OpenSnap image={res.data.data} duration={props.duration}/>
            })
            .then(err => {
                console.log(err.response)
                showMessage({
                    message: "Impossible d'afficher le snap",
                    type: "danger",
                })
            })
    }

    const styles = StyleSheet.create({
        block:{
            flexDirection: 'row'
        },
        square:{
            color: "red",
            fontSize : 35

        },
        blockPrincipal :{
            paddingTop : 20,
            paddingLeft : 23,
            paddingBottom : 10
        },
        email:{

            justifyContent: 'center',
            paddingLeft : 20,
            fontSize :100
        }
    })

    return(
        <View style={styles.blockPrincipal}>
            <TouchableOpacity onPress={openSnap}>
                <View style={styles.block}>
                    <Icon style={styles.square} name="square"/>
                    <View style={styles.email}>
                        <Text >{props.from}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default MessageReceived;