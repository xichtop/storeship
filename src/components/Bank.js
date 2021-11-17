import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Icon from 'react-native-vector-icons/Ionicons';
import { Input, Button } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import SearchableDropdown from 'react-native-searchable-dropdown';
import bankListApi from '../api/bankListAPI'
import { useDispatch } from 'react-redux'
import { update } from '../slice/registerSlice';
import StepIndicator from 'react-native-step-indicator';
const labels = ["Thông Tin", "Ngân Hàng", "CCCD"];
const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 35,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#112D4E',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#5AA469',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#5AA469',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#5AA469',
    stepIndicatorUnFinishedColor: '#aaaaaa',
    stepIndicatorCurrentColor: '#112D4E',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#ffffff',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#ffffff',
    labelColor: '#112D4E',
    labelSize: 13,
    currentStepLabelColor: '#112D4E'
}

const schema = yup.object().shape({
    account: yup.string().required('Tên người nhận không được để trống'),
    fullname: yup.string().required('Số điện thoại không được để trống'),
    bankname: yup.string().required('Địa chỉ không được để trống'),
    bankbranch: yup.string().required('Vui lòng chọn tỉnh'),
}).required();

export default function Bank({ navigation }) {

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        reValidateMode: 'onChange'
    });

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const [banks, setBanks] = useState([{ label: 'Agribank', value: 'Agribank', key: 'agribank' }]);

    const [selectedBanks, setSelectedBanks] = useState([]);

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const banks = await bankListApi.index();
                var temps = [];
                banks.data.forEach(bank => {
                    temps.push({
                        id: bank.short_name,
                        name:bank.short_name + ' - ' + bank.name,
                    })
                })
                setBanks(temps);
            } catch (error) {
                console.log('failed to fetch list banks', error);
            }
        }
        fetchBanks();
    }, [])

    const onSubmit = (data) => {

        const bank = {
            Fullname: data.fullname,
            AccountBank: data.account,
            BankName: data.bankname,
            BankBranch: data.bankbranch,
        }
        const action = update({
            bank
        })
        dispatch(action);
        navigation.navigate('Identity')

    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng Ký Tài Khoản</Text>
            <View style={{ width: '100%', paddingVertical: 10 }}>
                <StepIndicator
                    customStyles={customStyles}
                    stepCount={3}
                    currentPosition={1}
                    labels={labels}
                />
            </View>
            <View style={{ width: '100%', alignItems: 'flex-start', paddingLeft: 20, marginVertical: 10 }}>
                <Text style={{ fontSize: 15, color: '#112D4E' }}>Thông tin ngân hàng</Text>
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
                            <SearchableDropdown
                                onItemSelect={(item) => {
                                    onChange(item.id);
                                    setSelectedBanks(item);
                                }}
                                selectedItems={selectedBanks}
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
                                items={banks}
                                defaultIndex={0}
                                textInputProps={
                                    {
                                        placeholder: "Chọn ngân hàng ...",
                                        underlineColorAndroid: "transparent",
                                        style: {
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            borderWidth: 1,
                                            borderColor: '#3F72AF',
                                            borderRadius: 5,
                                            fontSize: 15,
                                        },
                                    }
                                }
                                listProps={
                                    {
                                        nestedScrollEnabled: true,
                                    }
                                }
                            />
                        )}
                        name="bankname"
                        defaultValue=""
                    />
                </View>
                <View style={{ width: '100%', alignItems: 'flex-start', paddingTop: 6, paddingLeft: 14 }}>
                    <Text style={{ color: 'red', fontSize: 12, }}>{errors.bankname ? errors.bankname.message : ''}</Text>
                </View>

                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            inputStyle={{ fontSize: 15 }}
                            inputContainerStyle={styles.input}
                            placeholder='Nhập chi nhánh ngân hàng'
                            leftIcon={
                                <Icon
                                    name='color-filter'
                                    size={18}
                                    color='#3F72AF'
                                />
                            }
                            labelStyle={{ color: '#3F72AF' }}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.bankbranch ? errors.bankbranch.message : ''}
                        />
                    )}
                    name="bankbranch"
                    defaultValue=""
                />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            inputStyle={{ fontSize: 15, textTransform: 'uppercase' }}
                            inputContainerStyle={styles.input}
                            placeholder='Nhập tên dầy đủ của khách hàng'
                            leftIcon={
                                <Icon
                                    name='happy'
                                    size={18}
                                    color='#3F72AF'
                                />
                            }
                            labelStyle={{ color: '#3F72AF', fontSize: 10 }}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.fullname ? errors.fullname.message : ''}
                        />
                    )}
                    name="fullname"
                    defaultValue=""
                />

                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            inputStyle={{ fontSize: 15 }}
                            inputContainerStyle={styles.input}
                            placeholder='Nhập số tài khoản của khách hàng'
                            leftIcon={
                                <Icon
                                    name='bookmarks'
                                    size={18}
                                    color='#3F72AF'
                                />
                            }
                            labelStyle={{ color: '#3F72AF' }}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.account ? errors.account.message : ''}
                        />
                    )}
                    name="account"
                    defaultValue=""
                />
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Button
                    title="Quay lại"
                    buttonStyle={{ ...styles.button, backgroundColor: 'green' }}
                    onPress={() => navigation.goBack()}
                    loading={isLoading}
                />
                <Button
                    title="Tiếp theo"
                    buttonStyle={styles.button}
                    onPress={handleSubmit(onSubmit)}
                    loading={isLoading}
                />
            </View>
        </View>
    )
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
        paddingTop: 60
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
        marginTop: 10,
        borderRadius: 10,
        width: 150,
        height: 40,
        marginHorizontal: 5
    }
});


