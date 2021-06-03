import React, {useState, useEffect, useCallback} from "react";
import {ScrollView, StyleSheet, View} from 'react-native';
import axios from "axios";
import config from "../../config";
import MessageReceived from "./MessageReceived";


// TODO: A finir lors de la connexion utilisateur.
export default function Message(props){

    const [view, setView] = useState(null);
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginTop: 33
        }
    })

    useEffect(() => {
        axios.get(config.urlApi + 'snaps')
            .then(res => {
                const view = res.data.data.map((item, k) => {
                    return <MessageReceived from={item.from} snapId={item.snap_id} duration={item.duration} key={k}/>
                })
                setView(view)
            })
            .catch(err => {
                if(config.debug){
                    console.log(err)
                }
            })
    }, [])

    return(
        <ScrollView style={styles.container}>
            {view}
        </ScrollView>
    )
}