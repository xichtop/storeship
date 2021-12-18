import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
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
import SearchableDropdown from 'react-native-searchable-dropdown';

const schema = yup.object().shape({
    name: yup.string().required('Tên người nhận không được để trống'),
    phone: yup.string().required('Số điện thoại không được để trống'),
    address: yup.string().required('Địa chỉ không được để trống'),
    province: yup.string().required('Vui lòng chọn tỉnh'),
    district: yup.string().required('Vui lòng chọn quận/huyện'),
    ward: yup.string().required('Vui lòng chọn phường'),
    goodName: yup.string().required('Tên hàng hóa không được để trống'),
    goodWeight: yup.string().required('Cân nặng không được để trống'),
    goodSize: yup.string().required('Kích thước không được để trống'),
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

    const [provinces, setProvinces] = useState([{ id: 'tinh', name: 'Tỉnh' }]);

    const [districts, setDistricts] = useState([{ id: 'huyen', name: 'Huyện' }]);

    const [wards, setWards] = useState([{ id: 'xa', name: 'Xã' }]);

    const [enableDistrict, setEnableDistrict] = useState('');

    const [enableWard, setEnableWard] = useState('');

    const [img, setImg] = useState('https://us.123rf.com/450wm/dirkercken/dirkercken1403/dirkercken140300029/26322661-photos-bouton-image-et-la-photo-galerie-ic%C3%B4ne.jpg?ver=6');

    const [selectedProvinces, setSelectedProvinces] = useState([]);

    const [selectedDistricts, setSelectedDistricts] = useState([]);

    const [selectedWards, setSelectedWards] = useState([]);

    useEffect(() => {
        const fetchListProvinces = async () => {
            try {
                const temp = [];
                const provincess = await provinceAPI.index();
                provincess.forEach(province => {
                    temp.push({
                        name: province.ProvinceName,
                        id: province.ProvinceCode,
                        // label: province.ProvinceName,
                        // value: province.ProvinceCode,
                        // key: province.ProvinceCode,
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
                        name: ward.WardName,
                        id: ward.WardCode,
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
                        name: district.DistrictName,
                        id: district.DistrictCode,
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
                GoodSize: data.goodSize,
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

        if (img === 'https://us.123rf.com/450wm/dirkercken/dirkercken1403/dirkercken140300029/26322661-photos-bouton-image-et-la-photo-galerie-ic%C3%B4ne.jpg?ver=6') {
            Alert.alert('Vui lòng tải ảnh lên');
        }
        else if (store.Status === 'UnVertify') {
            Alert.alert('Vui lòng xác thực tài khoản trước khi tạo đơn hàng!');
            navigation.navigate('Profile');
        }
        else {
            Alert.alert(
                "Tạo Đơn Hàng",
                "Bạn có chắc chắn muốn tạo đơn hàng này không?",
                [
                    {
                        text: "Không",
                        onPress: () => { },
                        style: "destructive",
                    },
                    {
                        text: "Có",
                        onPress: () => {
                            setIsLoading(true);
                            fetchAddOrder();
                        },
                        style: "cancel",
                    },
                ],
                {
                    cancelable: true,
                    onDismiss: () => {}
                }
            );
        }
    }
    return (
        <View style={styles.container}>
            <View style={{ width: '100%', alignItems: 'flex-start', paddingLeft: 20, marginBottom: 5 }}>
                <Text style={{ fontSize: 15, color: '#3F72AF', paddingTop: 15 }}>Thông tin đơn hàng</Text>
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
            <View style={{ width: '100%', alignItems: 'flex-start', paddingLeft: 20, marginBottom: 5 }}>
                <Text style={{ fontSize: 15, color: '#3F72AF' }}>Thông tin người nhận</Text>
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
                            <SearchableDropdown
                                onItemSelect={(item) => {
                                    onChange(item.id);
                                    setEnableDistrict(item.id);
                                    setSelectedProvinces(item);
                                }}
                                selectedItems={selectedProvinces}
                                containerStyle={{ width: '100%' }}
                                itemStyle={{
                                    padding: 10,
                                    marginTop: 2,
                                    backgroundColor: '#F9F7F7',
                                    borderColor: '#3F72AF',
                                    borderWidth: 1,
                                    borderRadius: 5,
                                }}
                                itemTextStyle={{ color: '#222' }}
                                itemsContainerStyle={{ maxHeight: 300, }}
                                items={provinces}
                                defaultIndex={0}
                                multi={false}
                                textInputProps={
                                    {
                                        placeholder: "Chọn tỉnh, thành phố",
                                        underlineColorAndroid: "transparent",
                                        style: {
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            borderWidth: 1,
                                            borderColor: '#3F72AF',
                                            borderRadius: 5,
                                            fontSize: 15,
                                            color: '#3F72AF'
                                        },
                                    }
                                }
                                placeholderTextColor='gray'
                                listProps={
                                    {
                                        nestedScrollEnabled: true,
                                    }
                                }
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
                            <SearchableDropdown
                                onItemSelect={(item) => {
                                    onChange(item.id);
                                    setEnableWard(item.id);
                                    setSelectedDistricts(item);
                                }}
                                selectedItems={selectedDistricts}
                                containerStyle={{ width: '50%', paddingRight: 3 }}
                                itemStyle={{
                                    padding: 10,
                                    marginTop: 2,
                                    backgroundColor: '#F9F7F7',
                                    borderColor: '#3F72AF',
                                    borderWidth: 1,
                                    borderRadius: 5,
                                }}
                                itemTextStyle={{ color: '#222' }}
                                itemsContainerStyle={{ maxHeight: 300, }}
                                items={districts}
                                defaultIndex={0}
                                multi={false}
                                textInputProps={
                                    {
                                        placeholder: "Chọn quận, huyện",
                                        underlineColorAndroid: "transparent",
                                        style: {
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            borderWidth: 1,
                                            borderColor: '#3F72AF',
                                            borderRadius: 5,
                                            fontSize: 15,
                                            color: '#3F72AF'
                                        },
                                    }
                                }
                                placeholderTextColor='gray'
                                listProps={
                                    {
                                        nestedScrollEnabled: true,
                                    }
                                }
                            />
                        )}
                        name="district"
                        defaultValue=""
                    />
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <SearchableDropdown
                                onItemSelect={(item) => {
                                    onChange(item.id);
                                    setSelectedWards(item);
                                }}
                                selectedItems={selectedWards}
                                containerStyle={{ width: '50%', paddingLeft: 3 }}
                                itemStyle={{
                                    padding: 10,
                                    marginTop: 2,
                                    backgroundColor: '#F9F7F7',
                                    borderColor: '#3F72AF',
                                    borderWidth: 1,
                                    borderRadius: 5,
                                }}
                                itemTextStyle={{ color: '#222' }}
                                itemsContainerStyle={{ maxHeight: 300, }}
                                items={wards}
                                defaultIndex={0}
                                multi={false}
                                textInputProps={
                                    {
                                        placeholder: "Chọn phường, xã",
                                        underlineColorAndroid: "transparent",
                                        style: {
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            borderWidth: 1,
                                            borderColor: '#3F72AF',
                                            borderRadius: 5,
                                            fontSize: 15,
                                            color: '#3F72AF'
                                        },
                                    }
                                }
                                placeholderTextColor='gray'
                                listProps={
                                    {
                                        nestedScrollEnabled: true,
                                    }
                                }
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
            <View style={{ width: '100%', alignItems: 'flex-start', paddingLeft: 20, marginBottom: 5 }}>
                <Text style={{ fontSize: 15, color: '#3F72AF' }}>Thông tin hàng hóa</Text>
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
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: 10
                    }}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <RNPickerSelect
                                    placeholder={{ label: 'Chọn cân nặng hàng hóa', value: '' }}
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
                                        { label: 'Từ 0 đến 1 : S', value: 'S', key: 'S' },
                                        { label: 'Từ 1 đến 3 : M', value: 'M', key: 'M' },
                                        { label: 'Từ 3 đến 5 : L', value: 'L', key: 'L' },
                                        { label: 'Lớn hơn 5 : XL', value: 'XL', key: 'XL' },
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
                            name="goodWeight"
                            defaultValue=""
                        />
                    </View>
                    <View style={{ width: '100%', alignItems: 'flex-start', paddingVertical: 3, paddingLeft: 14 }}>
                        <Text style={{ color: 'red', fontSize: 12, }}>{errors.goodWeight ? errors.goodWeight.message : ''}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: 10
                    }}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <RNPickerSelect
                                    placeholder={{ label: 'Chọn kích cỡ hàng hóa', value: '' }}
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
                                        { label: '0 - 30*30*30 : S', value: 'S', key: 'KS' },
                                        { label: '30*30*30 - 50*50*50: M', value: 'M', key: 'KM' },
                                        { label: '50*50*50 - 70*70*70 : L', value: 'L', key: 'KL' },
                                        { label: 'Lớn hơn 70*70*70 : XL', value: 'XL', key: 'KXL' },
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
                            name="goodSize"
                            defaultValue=""
                        />
                    </View>
                    <View style={{ width: '100%', alignItems: 'flex-start', paddingVertical: 3, paddingLeft: 14 }}>
                        <Text style={{ color: 'red', fontSize: 12, }}>{errors.goodSize ? errors.goodSize.message : ''}</Text>
                    </View>
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
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#3F72AF' }}>
                    <Text style={{ paddingBottom: 5, color: 'gray' }}>Hình ảnh</Text>
                    <TakePhoto handleGetImg={handleGetImg} width={100} height={100} />
                </View>
            </View>
            <Button
                title="Tạo đơn hàng"
                buttonStyle={styles.button}
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
            />
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
    input: {
        height: 24,
    },
    select: {
        fontSize: 14,
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