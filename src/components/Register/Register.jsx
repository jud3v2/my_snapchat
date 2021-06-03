import React, { useState } from "react";
import axios from 'axios';
import {StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import {Layout, Text, Input, Button, Icon} from '@ui-kitten/components';
import { showMessage } from "react-native-flash-message";
import config from "../../../src/config"

export default function Register(props){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [securePasswordEntry, setSecurePasswordEntry] = useState(true);
    const [securePasswordConfirmEntry, setSecurePasswordConfirmEntry] = useState(true);
    const [canSend, setCanSend] = useState(true);

    const cleanInput = () => {
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
    }

    const sendData = e => {
        e.preventDefault();
        e.stopPropagation();
        //TODO: créé une validation.
        if(canSend){
            axios.post(props.urlApi + 'inscription', {email: email, password: password})
                .then(response => {
                showMessage({
                    message: "Votre compte a bien été créé",
                    type: "success",
                });
                setTimeout(() => {
                    cleanInput();
                    props.navigation.navigate('Login')
                }, 1900)
            }).catch((error) => {
                //TODO: Faire la gestion des erreurs.
                showMessage({
                    message: "Une erreur est survenue",
                    type: 'danger',
                });
                if(config.debug){
                    console.log(error)
                }
            }).finally(() => setCanSend(false))
        }
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        text: {
            margin: 2,
            fontSize: 18,
        },
        input: {
            margin: 2,
        },
        button: {
            margin: 2,
            flexDirection: 'row',
            alignItems: 'center',
        },
        buttonText: {
            marginHorizontal: 8,
            color: 'white'
        },
        captionContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        captionIcon: {
            width: 10,
            height: 10,
            marginRight: 5
        },
        captionText: {
            fontSize: 12,
            fontWeight: "400",
            color: "#8F9BB3",
        },
        subContainer: {
            margin: 10,
        },
        marginSmall: {
            margin: 5
        }
    })

    const AlertIcon = (props) => (
        <Icon {...props} name='alert-circle-outline'/>
    );

    const togglePasswordEntry = () => {
        setSecurePasswordEntry(!securePasswordEntry);
    };

    const togglePasswordConfirmEntry = () => {
        setSecurePasswordConfirmEntry(!securePasswordConfirmEntry);
    };

    const renderPasswordIcon = (props) => (
        <TouchableWithoutFeedback onPress={togglePasswordEntry}>
            <Icon {...props} name={securePasswordEntry ? 'eye-off' : 'eye'}/>
        </TouchableWithoutFeedback>
    );
    const renderPasswordConfirmIcon = (props) => (
        <TouchableWithoutFeedback onPress={togglePasswordConfirmEntry}>
            <Icon {...props} name={securePasswordConfirmEntry ? 'eye-off' : 'eye'}/>
        </TouchableWithoutFeedback>
    );

    const renderCaption = () => {
        return (
            <View style={styles.captionContainer}>
                {AlertIcon(styles.captionIcon)}
                <Text style={styles.captionText}>Should contain at least 8 symbols</Text>
            </View>
        )
    }

    return(
        <Layout style={styles.container}>
            <Layout style={styles.subContainer}>
                <Layout style={styles.marginSmall}>
                    <Input
                        onChangeText={setEmail}
                        label={'Email :'}
                        value={email}
                        placeholder="Entrez votre email."
                        style={styles.input}
                        autoCapitalize='none'
                        autoCompleteType={'email'}
                        autoCorrect={false}
                    />
                </Layout>
                <Layout style={styles.marginSmall}>
                    <Input
                        label='Mot de passe :'
                        placeholder='Mot de passe.'
                        value={password}
                        caption={renderCaption}
                        accessoryRight={renderPasswordIcon}
                        secureTextEntry={securePasswordEntry}
                        onChangeText={setPassword}
                        autoCompleteType={'password'}
                        autoCorrect={false}
                    />
                </Layout>
                <Layout style={styles.marginSmall}>
                    <Input
                        label='Confirmer votre mot de passe :'
                        placeholder='Confirmer votre mot de passe.'
                        value={passwordConfirm}
                        caption={renderCaption}
                        accessoryRight={renderPasswordConfirmIcon}
                        secureTextEntry={securePasswordConfirmEntry}
                        onChangeText={setPasswordConfirm}
                        autoCompleteType={'password'}
                        autoCorrect={false}
                    />
                </Layout>
                <Layout>
                    <Button style={styles.button} onPress={e => sendData(e)}>
                        <Text style={styles.buttonText}>S'inscrire</Text>
                    </Button>
                    <Button style={styles.button} onPress={() => props.navigation.navigate('Login')}>
                        <Text style={styles.buttonText}>Se connecter</Text>
                    </Button>
                </Layout>
            </Layout>
        </Layout>
    )
}