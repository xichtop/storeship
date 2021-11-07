import React, { useState, useEffect } from "react";
import {
    Text, View, StyleSheet,
    ScrollView, KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard, Platform, Alert
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
import deliveryAPI from '../api/deliveryAPI';
import { showMessage } from "react-native-flash-message";
import TakePhoto from '../components/TakePhoto';
import { useSelector } from 'react-redux';

const schema = yup.object().shape({
    name: yup.string().required('Tên người nhận không được để trống'),
    phone: yup.string().required('Số điện thoại không được để trống'),
    address: yup.string().required('Địa chỉ không được để trống'),
    province: yup.string().required('Vui lòng chọn tỉnh'),
    district: yup.string().required('Vui lòng chọn quận/huyện'),
    ward: yup.string().required('Vui lòng chọn phường'),
    goodName: yup.string().required('Tên hàng hóa không được để trống'),
    goodWeight: yup.string().required('Cân nặng hàng hóa không được để trống'),
    goodType: yup.string().required('Vui lòng chọn loại hàng hóa'),
    shipType: yup.string().required('Vui lòng chọn loại giao hàng'),
    cod: yup.string().required('Tiền thu hộ không được để trống'),
}).required();

export default function Post({ navigation }) {

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        reValidateMode: 'onChange'
    });

    const store = useSelector(state => state.store.store);

    const token = useSelector(state => state.store.token);

    const [isLoading, setIsLoading] = useState(false);

    const [provinces, setProvinces] = useState([{ label: 'Tỉnh', value: 'tinh', key: 'tinh' }]);

    const [districts, setDistricts] = useState([{ label: 'Huyện', value: 'huyen', key: 'huyen' }]);

    const [wards, setWards] = useState([{ label: 'Xã', value: 'xa', key: 'xa' }]);

    const [enableDistrict, setEnableDistrict] = useState('');

    const [enableWard, setEnableWard] = useState('');

    const [img, setImg] = useState('https://static.thenounproject.com/png/396915-200.png');

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

        const fetchAddOrder = async () => {
            var item = {
                StoreId: store.StoreId,
                RecieverName: data.name,
                RecieverPhone: data.phone,
                ProvinceCode: data.province,
                DistrictCode: data.district,
                WardCode: data.ward,
                AddressDetail: data.address,
                Picture: img,
                COD: data.cod,
                ShipType: data.shipType,
                GoodName: data.goodName,
                GoodWeight: data.goodWeight,
                GoodType: data.goodType,
            }
            var result = null;
            try {
                result = await deliveryAPI.addItem(item, token);

            } catch (error) {
                console.log("Failed to fetch deliveries: ", error);
            }

            if (result.successful === true) {
                setTimeout(() => {
                    setIsLoading(false);
                    showMessage({
                        message: "Wonderfull!!!",
                        description: "Thêm đơn hàng thành công",
                        type: "success",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                    navigation.navigate('List');
                }, 1000);
            } else {
                setTimeout(() => {
                    setIsLoading(false);
                    showMessage({
                        message: "Thêm đơn hàng thất bại",
                        description: "Vui lòng thử lại sau",
                        type: "danger",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                    navigation.navigate('List');
                }, 1000);
            }
        }

        if (img === 'https://static.thenounproject.com/png/396915-200.png') {
            Alert.alert('Vui lòng tải ảnh lên');
        }
        else if (store.Status === 'UnVertify') {
            Alert.alert('Vui lòng xác thực tài khoản trước khi tạo đơn hàng!');
            navigation.navigate('Profile');
        }
        else {
            setIsLoading(true);
            fetchAddOrder();
        }
    }
    return (
        <View>
            <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={30}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.container}>
                            {/* <Text style={styles.title}>Tạo Đơn Hàng</Text> */}
                            <View style={{ width: '100%', alignItems: 'flex-start', paddingLeft: 20, marginVertical: 10 }}>
                                <Text style={{ fontSize: 15, color: '#112D4E' }}>Thông tin người nhận</Text>
                            </View>
                            <View style={styles.controller}>
                                <Controller
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            inputStyle={{ fontSize: 15 }}
                                            inputContainerStyle={styles.input}
                                            placeholder='Nhập tên người nhận'
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
                                            placeholder='Nhập số điện thoại người nhận'
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
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginHorizontal: 10
                                }}>
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
                                                        width: '100%',
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
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginHorizontal: 10,
                                    paddingTop: 10
                                }}>
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
                                                        marginRight: 10
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
                                </View>
                                <View style={{ width: '100%', alignItems: 'flex-start', paddingTop: 6, paddingLeft: 14 }}>
                                    <Text style={{ color: 'red', fontSize: 12, }}>{errors.province ?.message || errors.district ?.message || errors.ward ?.message || ''}</Text>
                                </View>
                            </View>
                            <View style={{ width: '100%', alignItems: 'flex-start', paddingLeft: 20, marginBottom: 10 }}>
                                <Text style={{ fontSize: 15, color: '#112D4E' }}>Thông tin hàng hóa</Text>
                            </View>
                            <View style={{ width: '95%', flexDirection: 'row' }}>
                                <View style={{ flex: 1.5 }}>
                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Input
                                                inputStyle={{ fontSize: 15 }}
                                                inputContainerStyle={styles.input}
                                                placeholder='Nhập tên hàng hóa'
                                                leftIcon={
                                                    <Icon
                                                        name='layers'
                                                        size={18}
                                                        color='#3F72AF'
                                                    />
                                                }
                                                labelStyle={{ color: '#3F72AF', fontSize: 10 }}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                errorMessage={errors.goodName ? errors.goodName.message : ''}
                                            />
                                        )}
                                        name="goodName"
                                        defaultValue=""
                                    />
                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <Input
                                                inputStyle={{ fontSize: 15 }}
                                                inputContainerStyle={styles.input}
                                                placeholder='Nhập cân nặng hàng hóa'
                                                leftIcon={
                                                    <Icon
                                                        name='barbell'
                                                        size={18}
                                                        color='#3F72AF'
                                                    />
                                                }
                                                labelStyle={{ color: '#3F72AF', fontSize: 10 }}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                keyboardType='numeric'
                                                errorMessage={errors.goodWeight ? errors.goodWeight.message : ''}
                                            />
                                        )}
                                        name="goodWeight"
                                        defaultValue=""
                                    />
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginHorizontal: 10
                                    }}>
                                        <Controller
                                            control={control}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <RNPickerSelect
                                                    placeholder={{ label: 'Chọn loại hàng hóa', value: '' }}
                                                    onValueChange={onChange}
                                                    value={value}
                                                    style={{
                                                        inputIOS: { ...styles.select },
                                                        iconContainer: {
                                                            top: 6,
                                                            right: 8,
                                                        },
                                                        viewContainer: {
                                                            flex: 1,
                                                        },
                                                        placeholder: {
                                                            color: 'gray',
                                                            fontSize: 15,
                                                        },
                                                    }}
                                                    items={[
                                                        { label: 'Tiêu chuẩn', value: 'Tiêu chuẩn', key: 'a' },
                                                        { label: 'Dễ vỡ', value: 'Dễ vỡ', key: 'b' },
                                                        { label: 'Giá trị cao', value: 'Giá trị cao', key: 'c' },
                                                    ]}
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
                                            name="goodType"
                                            defaultValue=""
                                        />
                                    </View>
                                    <View style={{ width: '100%', alignItems: 'flex-start', paddingTop: 6, paddingLeft: 14 }}>
                                        <Text style={{ color: 'red', fontSize: 12, }}>{errors.goodType ? errors.goodType.message : ''}</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#3F72AF' }}>
                                    <TakePhoto handleGetImg={handleGetImg} />
                                </View>
                            </View>
                            <View style={{ width: '100%', alignItems: 'flex-start', paddingLeft: 20, marginBottom: 10 }}>
                                <Text style={{ fontSize: 15, color: '#112D4E', paddingTop: 15 }}>Thông tin đơn hàng</Text>
                            </View>
                            <View style={styles.controller}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginHorizontal: 10
                                }}>
                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <RNPickerSelect
                                                placeholder={{ label: 'Chọn loại giao hàng', value: '' }}
                                                onValueChange={onChange}
                                                value={value}
                                                style={{
                                                    inputIOS: { ...styles.select },
                                                    iconContainer: {
                                                        top: 6,
                                                        right: 8,
                                                    },
                                                    viewContainer: {
                                                        flex: 1,
                                                    },
                                                    placeholder: {
                                                        color: 'gray',
                                                        fontSize: 15,
                                                    },
                                                }}
                                                items={[
                                                    { label: 'Giao hàng nhanh', value: 'Giao hàng nhanh', key: 'a' },
                                                    { label: 'Giao hàng tiêu chuẩn', value: 'Giao hàng tiêu chuẩn', key: 'b' },
                                                ]}
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
                                        name="shipType"
                                        defaultValue=""
                                    />
                                </View>
                                <View style={{ width: '100%', alignItems: 'flex-start', paddingTop: 6, paddingLeft: 14 }}>
                                    <Text style={{ color: 'red', fontSize: 12, }}>{errors.shipType ? errors.shipType.message : ''}</Text>
                                </View>
                                <Controller
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            inputStyle={{ fontSize: 15 }}
                                            inputContainerStyle={styles.input}
                                            placeholder='Nhập tiền thu hộ'
                                            leftIcon={
                                                <Icon
                                                    name='wallet'
                                                    size={18}
                                                    color='#3F72AF'
                                                />
                                            }
                                            labelStyle={{ color: '#3F72AF', fontSize: 10 }}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            keyboardType='numeric'
                                            errorMessage={errors.cod ? errors.cod.message : ''}
                                        />
                                    )}
                                    name="cod"
                                    defaultValue=""
                                />
                            </View>
                            <Button
                                title="Tạo đơn hàng"
                                buttonStyle={styles.button}
                                onPress={handleSubmit(onSubmit)}
                                loading={isLoading}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
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
        fontSize: 20,
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
        height: 40
    }
});