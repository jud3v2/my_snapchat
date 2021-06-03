import React, {useState} from 'react';
import 'react-native-gesture-handler';
import {AsyncStorage, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Register from "./src/components/Register/Register";
import Login from "./src/components/Login/Login";
import Home from "./src/components/Home/Home";
import Message from "./src/components/User/Message";
import Image from "./src/components/Image/Image";
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from "@ui-kitten/eva-icons";
import FlashMessage, {showMessage} from "react-native-flash-message";
import config from "./src/config";
import axios from "axios";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import ShowImage from "./src/components/Image/ShowImage";
import ShowUserToSnap from "./src/components/User/ShowUserToSnap";

export default function App() {
    const [user, setUser] = useState(false);
    const [users, setUsers] = useState([]);
    (async () => {
        let token = await AsyncStorage.getItem('token', (err, result) => {
            return result;
        });
        if (token){
            setUser(token)
        }
    })()
    if (user){
        axios.interceptors.request.use(function (config) {
            config.headers.token = user;
            return config;
        }, function (error) {
            showMessage({
                message: "Une erreur est survenue, lors de l'interception de la requête",
                type: 'error',
            })
            return Promise.reject(error);
        });
    }
    StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        home: {
            margin: 1,
        }
    });
    const logout = () => {setUser(false);AsyncStorage.removeItem('token');}
    const Stack = createStackNavigator();
    const Tab = createBottomTabNavigator();
    function CreateUserLogStack(){
        const AppDrawerNavigation = () => {
            return (
                // https://reactnavigation.org/docs/stack-navigator#animation-related-options
                <Tab.Navigator>
                    <Tab.Screen name={"Home"} options={{title: 'Accueil'}}>
                        {props => <Home {...props} logout={logout} user={user}/>}
                    </Tab.Screen>
                    <Tab.Screen name={"Image"} options={{title: 'Image'}} component={ShowImage} />
                    <Tab.Screen name={"Message"} options={{title: 'Message'}} component={Message} />
                </Tab.Navigator>
            )
        }
        return (
            <Stack.Navigator screenOptions={{gestureEnabled: true}} headerMode={'none'}>
                {!user ? (
                    <>
                        {/*L'utilisateur n'est pas connecté*/}
                        <Stack.Screen name="Login" options={{title: 'Connexion'}}
                        >{props => <Login {...props} setUser={setUser} urlApi={config.urlApi}/>}</Stack.Screen>
                        <Stack.Screen name="Register" options={{title: 'Inscription'}}
                        >{props => <Register {...props} urlApi={config.urlApi}/>}</Stack.Screen>
                    </>
                ) : (
                    <>
                        {/*L'utilisateur est connecté*/}
                        <Stack.Screen name={"Home"} options={{title: 'my_snapchat'}}  component={AppDrawerNavigation}/>
                        <Stack.Screen name={"ShowUserToSnap"} component={ShowUserToSnap}/>
                    </>
                )}
            </Stack.Navigator>
        );
    }
    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva.light}>
                <NavigationContainer>
                    <CreateUserLogStack />
                    <FlashMessage position="top" />
                </NavigationContainer>
            </ApplicationProvider>
        </>
    );
}