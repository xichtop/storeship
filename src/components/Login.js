import React, { useState, useEffect } from "react";
import { Text, View, Image, Alert, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Icon from 'react-native-vector-icons/Ionicons';
import { Input, Button } from 'react-native-elements';
import logo from '../../assets/logo.png';
import storeAPI from '../api/storeAPI';
import { showMessage } from "react-native-flash-message";
import { login } from '../slice/storeSlice';
import { useDispatch } from 'react-redux';
// import * as LocalAuthentication from 'expo-local-authentication'
// import {
//     hasHardwareAsync,
//     isEnrolledAsync,
//     authenticateAsync
// } from 'expo-local-authentication';

const schema = yup.object().shape({
    userName: yup.string().required('Tên đăng nhập không được để trống'),
    password: yup.string().required('Mật khẩu không được để trống'),
}).required();

export default function Login({ navigation }) {

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        reValidateMode: 'onChange'
    });

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const handleFotgotPassword = () => {

    }

    const hanldeRegister = () => {
        navigation.navigate('Register');
    }

    const onSubmit = (data) => {
        setIsLoading(true);
        const item = {
            username: data.userName,
            password: data.password,
        }
        const fetchLogin = async () => {
            var result = {};
            try {
                result = await storeAPI.login(item);
            } catch (error) {
                console.log("Failed to fetch login: ", error);
            }
            console.log(result);
            if (result.successful === false) {
                setTimeout(() => {
                    setIsLoading(false);
                    showMessage({
                        message: "Đăng nhập thất bại!!!",
                        description: "Vui lòng kiểm tra lại tài khoản hoặc mật khẩu",
                        type: "danger",
                        duration: 2500,
                        icon: 'auto',
                        floating: true,
                    });
                }, 3000)
            } else {
                setTimeout(() => {
                    setIsLoading(false);
                    showMessage({
                        message: "Đăng nhập thành công!!!",
                        description: `Xin chào ${result.store.StoreName}`,
                        type: "success",
                        duration: 2500,
                        icon: 'auto',
                        floating: true,
                    });
                    const store = result.store;
                    const token = result.accessToken;
                    const action = login({
                        store,
                        token
                    })
                    dispatch(action);
                    navigation.navigate('Home');
                }, 3000)
            }
        }
        fetchLogin();
    }
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#6a51ae" />
            <Image style={styles.logo}
                source={logo} />
            <Text style={styles.title}>Đăng Nhập</Text>
            <View style={styles.controler}>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            placeholder='Nhập tên đăng nhập của bạn'
                            label='Tên Đăng Nhập'
                            leftIcon={
                                <Icon
                                    name='person-circle'
                                    size={24}
                                    color='#3F72AF'
                                />
                            }
                            labelStyle={{ color: '#3F72AF' }}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.userName ? errors.userName.message : ''}
                        />
                    )}
                    name="userName"
                    defaultValue=""
                />

                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            placeholder='Nhập mật khẩu của bạn'
                            label='Mật Khẩu'
                            leftIcon={
                                <Icon
                                    name='lock-closed'
                                    size={24}
                                    color='#3F72AF'
                                />
                            }
                            labelStyle={{ color: '#3F72AF' }}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={true}
                            errorMessage={errors.password ? errors.password.message : ''}
                        />
                    )}
                    name="password"
                    defaultValue=""
                />
            </View>
            <View style={{ width: '100%', alignItems: 'flex-end', marginTop: -10, paddingRight: 10 }}>
                <Button
                    title="Quên mật khẩu?"
                    buttonStyle={{ textColor: 'red' }}
                    type="clear"
                    onpress={{ handleFotgotPassword }}
                />
            </View>
            <Button
                title="Đăng Nhập"
                buttonStyle={styles.button}
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
            />
            {/* <TouchableOpacity onPress={handleBiometricAuth}>
                <Image
                    // source={{ uri: 'https://static.wikia.nocookie.net/ipod/images/a/a7/Face_ID.png/revision/latest?cb=20200801223050' }}
                    source={logo}
                    style={{ height: 100, width: 100 }}
                />
            </TouchableOpacity>
            <Text> {isBiometricSupported ? 'Your device is compatible with Biometrics'
                : 'Face or Fingerprint scanner is available on this device'}
            </Text> */}
            <View
                style={
                    {
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: 30
                    }
                }
            >
                <Text>Chưa có tài khoản?</Text>
                <Button
                    title='Đăng ký'
                    type="clear"
                    onPress={hanldeRegister}
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    controler: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
    },
    logo: {
        width: 250,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: '#3F72AF',
        textTransform: "uppercase",
        paddingBottom: 30,
        marginTop: -30
    },
    button: {
        backgroundColor: '#3F72AF',
        color: 'black',
        marginTop: 10,
        borderRadius: 10,
        width: 150,
        height: 40
    }
});