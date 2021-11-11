import React, { useState, useEffect } from "react";
import {
    Text, View, StyleSheet,
    ScrollView, Alert, SafeAreaView
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Icon from 'react-native-vector-icons/Ionicons';
import { Input, Button } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import provinceAPI from '../api/provinceAPI';
import districtAPI from '../api/districtAPI';
import wardAPI from '../api/wardAPI';
import storeAPI from '../api/storeAPI';
import TakePhoto from './TakePhoto';
import { useDispatch } from 'react-redux';
import { create } from '../slice/registerSlice';
import StepIndicator from 'react-native-step-indicator';
const labels = ["Thông Tin", "Ngân Hàng", "CCCD"];
const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 35,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#112D4E',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#112D4E',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#112D4E',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#112D4E',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#112D4E',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#ffffff',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#112D4E'
}
const schema = yup.object().shape({
    username: yup.string().strict(true).trim('Tên đăng nhập không được chứa khoảng trắng').required('Tên đăng nhập không được để trống'),
    password: yup.string().strict(true).trim('Mật khẩu không được chứa khoảng trắng').required('Mật khẩu không được để trống'),
    rePassword: yup.string().strict(true)
        .oneOf([yup.ref('password'), null], "Mật khẩu không trùng nhau!")
        .trim('Mật khẩu không được chứa khoảng trắng').required('Mật khẩu không được để trống'),
    name: yup.string().required('Tên cửa hàng không được để trống'),
    phone: yup.string().required('Số điện thoại không được để trống'),
    email: yup.string().required('Email không được để trống'),
    address: yup.string().required('Địa chỉ không được để trống'),
    province: yup.string().required('Vui lòng chọn tỉnh'),
    district: yup.string().required('Vui lòng chọn quận/huyện'),
    ward: yup.string().required('Vui lòng chọn phường'),
}).required();

export default function Post({ navigation }) {

    const { control, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(schema),
        reValidateMode: 'onChange'
    });

    const dispatch = useDispatch();

    const [provinces, setProvinces] = useState([{ label: 'Tỉnh', value: 'tinh', key: 'tinh' }]);

    const [districts, setDistricts] = useState([{ label: 'Huyện', value: 'huyen', key: 'huyen' }]);

    const [wards, setWards] = useState([{ label: 'Xã', value: 'xa', key: 'xa' }]);

    const [enableDistrict, setEnableDistrict] = useState('');

    const [enableWard, setEnableWard] = useState('');

    const [img, setImg] = useState('https://us.123rf.com/450wm/dirkercken/dirkercken1403/dirkercken140300029/26322661-photos-bouton-image-et-la-photo-galerie-ic%C3%B4ne.jpg?ver=6');

    useEffect(() => {
        const fetchListProvinces = async () => {
            try {
                const temp = [];
                const provincess = await provinceAPI.index();
                provincess.forEach(province => {
                    temp.push({
                        label: province.ProvinceName,
                        value: province.ProvinceCode,
                        key: province.ProvinceCode,
                    })
                })
                setProvinces(temp);
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        fetchListProvinces();
    }, [])

    useEffect(() => {
        const fetchListWards = async () => {
            try {
                const temp = [];
                const wards = await wardAPI.getByDistrict(enableWard);
                wards.forEach(ward => {
                    temp.push({
                        label: ward.WardName,
                        value: ward.WardCode,
                        key: ward.WardCode,
                    })
                })
                setWards(temp);
            } catch (error) {
                console.log("Failed to fetch ward list: ", error);
            }
        }
        fetchListWards();
    }, [enableWard])

    useEffect(() => {
        const fetchListDistricts = async () => {
            try {
                const temp = [];
                const districts = await districtAPI.getByProvice(enableDistrict);
                districts.forEach(district => {
                    temp.push({
                        label: district.DistrictName,
                        value: district.DistrictCode,
                        key: district.DistrictCode,
                    })
                })
                setDistricts(temp);
            } catch (error) {
                console.log("Failed to fetch district list: ", error);
            }
        }
        fetchListDistricts();
    }, [enableDistrict])

    const handleGetImg = (image) => {
        console.log(image);
        setImg(image);
    }

    const onSubmit = (data) => {

        const fetchStores = async () => {
            try {
                const accounts = await storeAPI.check(data.username);
                if (accounts.length > 0) {
                    // Alert.alert('Tên đăng nhập đã tồn tại');
                    setError("username", {
                        type: "manual",
                        message: "Tên đăng nhập đã tồn tại!",
                    });
                }
                else if (img === 'https://static.thenounproject.com/png/396915-200.png') {
                    Alert.alert('Vui lòng tải ảnh lên');
                }
                else {
                    const store = {
                        Username: data.username,
                        Password: data.password,
                        Email: data.email,
                        StoreName: data.name,
                        Phone: data.phone,
                        ProvinceCode: data.province,
                        DistrictCode: data.district,
                        WardCode: data.ward,
                        AddressDetail: data.address,
                        Picture: img,
                    }
                    const action = create({
                        store
                    })
                    dispatch(action);
                    navigation.navigate('Bank')
                }
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        fetchStores();
    }
    return (
        <View style={{ marginTop: 60 }}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Đăng Ký Tài Khoản</Text>
                    <View style={{ width: '100%' }}>
                        <StepIndicator
                            customStyles={customStyles}
                            stepCount={3}
                            currentPosition={0}
                            labels={labels}
                        />
                    </View>
                    <View style={{ width: '100%', alignItems: 'flex-start', paddingLeft: 20, marginVertical: 10 }}>
                        <Text style={{ fontSize: 15, color: '#112D4E' }}>Thông tin cửa hàng</Text>
                    </View>
                    <View style={styles.controller}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    inputStyle={{ fontSize: 15 }}
                                    inputContainerStyle={styles.input}
                                    placeholder='Nhập tên đăng nhập'
                                    leftIcon={
                                        <Icon
                                            name='person-circle'
                                            size={18}
                                            color='#3F72AF'
                                        />
                                    }
                                    labelStyle={{ color: '#3F72AF', fontSize: 10 }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.username ? errors.username.message : ''}
                                />
                            )}
                            name="username"
                            defaultValue=""
                        />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    inputStyle={{ fontSize: 15 }}
                                    inputContainerStyle={styles.input}
                                    placeholder='Nhập mật khẩu'
                                    leftIcon={
                                        <Icon
                                            name='lock-closed'
                                            size={18}
                                            color='#3F72AF'
                                        />
                                    }
                                    labelStyle={{ color: '#3F72AF' }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    // secureTextEntry={true}
                                    errorMessage={errors.password ? errors.password.message : ''}
                                />
                            )}
                            name="password"
                            defaultValue=""
                        />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    inputStyle={{ fontSize: 15 }}
                                    inputContainerStyle={styles.input}
                                    placeholder='Nhập lại mật khẩu'
                                    leftIcon={
                                        <Icon
                                            name='lock-closed'
                                            size={18}
                                            color='#3F72AF'
                                        />
                                    }
                                    labelStyle={{ color: '#3F72AF' }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    // secureTextEntry={true}
                                    errorMessage={errors.rePassword ? errors.rePassword.message : ''}
                                />
                            )}
                            name="rePassword"
                            defaultValue=""
                        />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    inputStyle={{ fontSize: 15 }}
                                    inputContainerStyle={styles.input}
                                    placeholder='Nhập tên cửa hàng'
                                    leftIcon={
                                        <Icon
                                            name='information-circle'
                                            size={18}
                                            color='#3F72AF'
                                        />
                                    }
                                    labelStyle={{ color: '#3F72AF', fontSize: 10 }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.name ? errors.name.message : ''}
                                />
                            )}
                            name="name"
                            defaultValue=""
                        />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    inputStyle={{ fontSize: 15 }}
                                    inputContainerStyle={styles.input}
                                    placeholder='Nhập số điện thoại cửa hàng'
                                    leftIcon={
                                        <Icon
                                            name='call'
                                            size={18}
                                            color='#3F72AF'
                                        />
                                    }
                                    labelStyle={{ color: '#3F72AF' }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    // secureTextEntry={true}
                                    errorMessage={errors.phone ? errors.phone.message : ''}
                                />
                            )}
                            name="phone"
                            defaultValue=""
                        />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    inputStyle={{ fontSize: 15 }}
                                    inputContainerStyle={styles.input}
                                    placeholder='Nhập email cửa hàng'
                                    leftIcon={
                                        <Icon
                                            name='mail'
                                            size={18}
                                            color='#3F72AF'
                                        />
                                    }
                                    labelStyle={{ color: '#3F72AF' }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    // secureTextEntry={true}
                                    errorMessage={errors.email ? errors.email.message : ''}
                                />
                            )}
                            name="email"
                            defaultValue=""
                        />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    inputStyle={{ fontSize: 15 }}
                                    inputContainerStyle={styles.input}
                                    placeholder='Nhập số nhà, tên đường'
                                    leftIcon={
                                        <Icon
                                            name='home'
                                            size={18}
                                            color='#3F72AF'
                                        />
                                    }
                                    labelStyle={{ color: '#3F72AF' }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.address ? errors.address.message : ''}
                                />
                            )}
                            name="address"
                            defaultValue=""
                        />

                    </View>
                    <View style={{ width: '95%', flexDirection: 'row' }}>
                        <View style={{ flex: 1.5, paddingLeft: 10, }}>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <RNPickerSelect
                                        placeholder={{ label: 'Chọn tỉnh', value: '' }}
                                        onValueChange={(value) => {
                                            onChange(value);
                                            setEnableDistrict(value);
                                        }}
                                        value={value}
                                        style={{
                                            inputIOS: { ...styles.select },
                                            iconContainer: {
                                                top: 6,
                                                right: 8,
                                            },
                                            viewContainer: {
                                                flex: 1,
                                                marginRight: 10,
                                                marginBottom: 10
                                            },
                                            placeholder: {
                                                color: 'gray',
                                                fontSize: 15,
                                            },
                                        }}
                                        items={provinces}
                                        Icon={() => {
                                            return (
                                                <Icon
                                                    name='caret-down'
                                                    size={18}
                                                    color='#3F72AF'
                                                />
                                            );
                                        }}
                                    />
                                )}
                                name="province"
                                defaultValue=""
                            />
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <RNPickerSelect
                                        placeholder={{ label: 'Chọn quận/huyện', value: '' }}
                                        onValueChange={(value) => {
                                            onChange(value);
                                            setEnableWard(value);
                                        }}
                                        value={value}
                                        disabled={enableDistrict === '' ? true : false}
                                        style={{
                                            inputIOS: { ...styles.select },
                                            iconContainer: {
                                                top: 6,
                                                right: 8,
                                            },
                                            viewContainer: {
                                                flex: 1,
                                                marginRight: 10,
                                                marginBottom: 10
                                            },
                                            placeholder: {
                                                color: 'gray',
                                                fontSize: 15,
                                            },
                                        }}
                                        items={districts}
                                        Icon={() => {
                                            return (
                                                <Icon
                                                    name='caret-down'
                                                    size={18}
                                                    color='#3F72AF'
                                                />
                                            );
                                        }}
                                    />
                                )}
                                name="district"
                                defaultValue=""
                            />
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <RNPickerSelect
                                        placeholder={{ label: 'Chọn phường/xã', value: '' }}
                                        onValueChange={onChange}
                                        value={value}
                                        disabled={enableWard === '' ? true : false}
                                        style={{
                                            inputIOS: { ...styles.select },
                                            iconContainer: {
                                                top: 6,
                                                right: 8,
                                            },
                                            viewContainer: {
                                                flex: 1,
                                                marginRight: 10,
                                            },
                                            placeholder: {
                                                color: 'gray',
                                                fontSize: 15,
                                            },
                                        }}
                                        items={wards}
                                        Icon={() => {
                                            return (
                                                <Icon
                                                    name='caret-down'
                                                    size={18}
                                                    color='#3F72AF'
                                                />
                                            );
                                        }}
                                    />
                                )}
                                name="ward"
                                defaultValue=""
                            />
                            <View style={{ width: '100%', alignItems: 'flex-start', paddingTop: 6, }}>
                                <Text style={{ color: 'red', fontSize: 12, }}>{errors.province ?.message || errors.district ?.message || errors.ward ?.message || ''}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#3F72AF', paddingLeft: 5 }}>
                            <TakePhoto handleGetImg={handleGetImg} width={100} height={100} />
                        </View>
                    </View>

                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        title="Tiếp Theo"
                        buttonStyle={styles.button}
                        onPress={handleSubmit(onSubmit)}
                    />
                    <View
                        style={
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingTop: 15
                            }
                        }
                    >
                        <Text>Đã có tài khoản?</Text>
                        <Button
                            title='Đăng nhập'
                            type="clear"
                            onPress={() => navigation.navigate('Login')}
                        />
                    </View>
                </View>
            </ScrollView>
        </View >
    );
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    controller: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
    },
    logo: {
        width: 250,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: '#3F72AF',
        textTransform: "uppercase",
        paddingBottom: 20,
    },
    input: {
        height: 30,
    },
    select: {
        fontSize: 16,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#3F72AF',
        borderRadius: 4,
        color: '#3F72AF',
        paddingRight: 30,
    },
    button: {
        backgroundColor: '#3F72AF',
        color: 'black',
        marginTop: 10,
        borderRadius: 10,
        width: 150,
        height: 40,
        marginTop: 30,
    }
});