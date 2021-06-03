import React, {useState, useEffect} from "react";
import axios from "axios";
import config from "../../config";
import {showMessage} from "react-native-flash-message";
import {Button, Text} from "@ui-kitten/components";
import {ScrollView} from "react-native";
import {CommonActions} from "@react-navigation/native";

export default function ShowUserToSnap(props){
    const [users, setUsers] = useState([]);
    const [image, setImage] = useState([]);
    const [duration, setDuration] = useState(60);

    useEffect(() => {
        if(users.length === 0){
            if(props.route.params.duration){
                setDuration(props.route.params.duration);
            }
            if(props.route.params.image){
                setImage(props.route.params.image);
            }
            axios.get(config.urlApi + 'all')
                .then(response => {
                    setUsers(response.data.data);
                })
                .catch(err => {
                    showMessage({
                        type: 'danger',
                        message: "Une erreur s'est produite lors de la requête",
                    })
                    if(config.debug){
                        console.log(err)
                    }
                })
        }
    }, [])

    const send = (sendTo) => {
        const fd = new FormData();
        fd.append('file', image)
        fd.append('duration', duration)
        fd.append('to', sendTo)
        axios.post(config.urlApi + 'snap', fd)
            .then(res => {
                showMessage({
                    type: 'success',
                    message: "Le snap à été envoyé",
                })
                setTimeout(() => {
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: 'Home' },
                            ],
                        })
                    );
                }, 500)
            })
            .catch(err => {
                config.debug ? console.error(err.response) : console.log('')
                showMessage({
                    type: 'danger',
                    message: "Une erreur s'est produite lors de l'envoie du snap",
                })
            })
    }
    const usersTag = users.map((item) => {
        return (
            <Button key={item.email} onPress={() => send(item.email)} status={'info'}>
                <Text>
                    Envoyer à {item.email}
                </Text>
            </Button>
        )
    })
    return (
        <ScrollView>
            {usersTag}
        </ScrollView>
    )
}