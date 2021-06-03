import React, {useState, useEffect, useRef} from 'react';
import {Dimensions, Platform, StyleSheet, TouchableOpacity, View} from "react-native";
import { Camera } from 'expo-camera';
import {Layout, Text} from "@ui-kitten/components";
import  Icon  from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

export default function Home(props){
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [haveFlash, setHaveFlash] = useState(true);
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
    const camera = useRef(null);

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })()
    }, [])

    useEffect(() => {
        if (!haveFlash){
            setFlashMode(Camera.Constants.FlashMode.on)
        } else {
            setFlashMode(Camera.Constants.FlashMode.off)
        }
    }, [haveFlash])

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const takePicture = async () => {
        if(camera){
            const data = await camera.current.takePictureAsync()
            return props.navigation.navigate('Image', {image: data})
        }
    };

    if (hasPermission === null){
        return <Layout />
    }

    if (hasPermission === false){
        return <Layout>
            <Text>Veuillez autorisé la permission d'accéder à la caméra</Text>
        </Layout>
    }

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: windowWidth,
            height: windowHeight
        },
        camera: {
            flex: 1
        },
        subContainer: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: 'transparent',
        },
        subContainerFlash: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: 'transparent'
        },
        touchableContent: {
            flex: 1,
            alignSelf: 'flex-start',
            alignItems: 'flex-end'
        },
        takeAPhoto: {
            flex: 1,
            alignItems: 'flex-end',
            alignSelf: 'center',
            justifyContent: 'center',
        },
        text: {
            fontSize: 20,
            paddingBottom: 20,
            color: 'white'
        },
        rotateIcon: {
            height: 20,
            width: 20,
        },
        sync: {
            marginTop: 30,
            marginRight: 15,
        }
    });

    return(
        <View style={styles.container}>
            {/*<Button onPress={() => props.logout()}> Logout </Button>*/}
            <Camera style={styles.camera}
                    type={type}
                    flashMode={flashMode}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                    ref={camera}>
                <View style={styles.subContainer}>
                    <TouchableOpacity
                        style={styles.touchableContent}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}>
                        <View style={styles.sync}>
                            <Icon color={'#ffffff'} name={'sync'} size={60}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.subContainerFlash}>
                    <TouchableOpacity
                        style={styles.touchableContent}
                        onPress={() => setHaveFlash(!haveFlash)}>
                        <View style={styles.sync}>
                            <Icon color={'#ffffff'} name={haveFlash ? 'flash-off-outline' : 'flash-outline'} size={60}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.takeAPhoto}>
                    <TouchableOpacity onPress={takePicture}>
                        <Icon color={'#ffffff'} name={'ellipse-outline'} size={100}/>
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    )
}