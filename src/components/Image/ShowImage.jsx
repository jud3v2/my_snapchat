import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Dimensions, ImageBackground, TouchableOpacity} from 'react-native';
import {Button, Layout} from "@ui-kitten/components";
import axios from 'axios';
import {showMessage} from "react-native-flash-message";
import PropTypes from 'prop-types';
import config from "../../config";
import * as ImagePicker from "expo-image-picker";
import { CommonActions } from '@react-navigation/native';
import ShowUserToSnap from "../User/ShowUserToSnap";


export default function ShowImage(props){

    const [image, setImage] = useState(false)
    const [duration, setDuration] = useState(60)

    useEffect(() => {
        if(props.route.params !== undefined && props.route.params.image){
            setImage(props.route.params.image);
        }
    })

    const styles = StyleSheet.create({
        container: {
            backgroundColor: 'transparent',
        },
        buttonContainer: {
            position: 'relative',
            marginTop: 33,
            backgroundColor: 'transparent'
        },
        secondContainer: {
            position: 'relative',
            backgroundColor: 'transparent'
        },
        buttonSendSnap: {
        }
    })

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const cancel = () => {
        setImage(false);
        return props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                ],
            })
        );
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            return props.navigation.navigate('Image', {image: result})
        }
    };

    const send = () => {
        return props.navigation.navigate('ShowUserToSnap', {
            duration: duration,
            image: image,
        })
    }

    if (image !== false){
        return <Layout style={styles.container}>
            <Layout>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Button status={'info'} style={styles.buttonSendSnap} onPress={send}>Envoyer</Button>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondContainer}>
                    <Button status={'danger'} style={styles.buttonSendSnap} onPress={cancel}>Annuler</Button>
                </TouchableOpacity>
            </Layout>
            <Image source={image} style={{width: windowWidth, height: windowHeight}}/>
        </Layout>
    } else {
        return <Layout>
            <TouchableOpacity style={styles.buttonContainer}>
                <Button status={'info'} style={styles.buttonSendSnap} onPress={pickImage}>Ouvrir la galerie</Button>
            </TouchableOpacity>
        </Layout>;
    }
}