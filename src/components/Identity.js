import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import { useSelector } from 'react-redux'
import QRCode from './QRCode'
import storeAPI from '../api/storeAPI'
import { showMessage } from "react-native-flash-message";
import StepIndicator from 'react-native-step-indicator';
const labels = ["Thông Tin", "Ngân Hàng", "CCCD"];
const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 35,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#112D4E',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: 'green',
    stepStrokeUnFinishedColor: 'green',
    separatorFinishedColor: 'green',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: 'green',
    stepIndicatorUnFinishedColor: '#112D4E',
    stepIndicatorCurrentColor: '#112D4E',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#ffffff',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#112D4E',
    labelSize: 13,
    currentStepLabelColor: '#112D4E'
}

export default function Identity({ navigation }) {

    const store = useSelector(state => state.register.store);

    const bank = useSelector(state => state.register.bank);

    const [isLoading, setIsLoading] = useState(false);

    const [info, setInfo] = useState({
        IdentityId: '',
        Fullname: '',
        Birthday: '',
        Sex: '',
        Address: '',
        GetDate: ''
    })

    const handleQR = (data) => {
        const strings = data.split('|');
        setInfo({
            IdentityId: strings[0],
            Fullname: strings[2],
            Birthday: `${strings[3].slice(4, 8)}-${strings[3].slice(2, 4)}-${strings[3].slice(0, 2)}`,
            Sex: strings[4],
            Address: strings[5],
            GetDate: `${strings[6].slice(4, 8)}-${strings[6].slice(2, 4)}-${strings[6].slice(0, 2)}`,
        })
    }

    const hanldeSubmit = () => {
        setIsLoading(true);
        const fetchAddStore = async () => {
            var result = null;
            const item = {
                store,
                bank,
                identity: info
            }
            try {
                result = await storeAPI.addItem(item);

            } catch (error) {
                console.log("Failed to fetch deliveries: ", error);
            }

            if (result.successful === true) {
                setTimeout(() => {
                    setIsLoading(false);
                    showMessage({
                        message: "Wonderfull!!!",
                        description: "Thêm tài khoản thành công",
                        type: "success",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                }, 3000);
            } else {
                setTimeout(() => {
                    setIsLoading(false);
                    showMessage({
                        message: "Thêm tài khoản thất bại",
                        description: "Vui lòng thử lại sau",
                        type: "danger",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                }, 3000);
            }
            navigation.navigate('Login');
        }
        fetchAddStore();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng Ký Tài Khoản</Text>
            <View style={{ width: '100%', paddingVertical: 10 }}>
                <StepIndicator
                    customStyles={customStyles}
                    stepCount={3}
                    currentPosition={2}
                    labels={labels}
                />
            </View>
            <View style={{ width: '100%', alignItems: 'flex-start', paddingLeft: 20, marginVertical: 10 }}>
                <Text style={{ fontSize: 15, color: '#112D4E', }}>Quyét mã QR để lấy thông tin</Text>
            </View>
            <View style={styles.controller}>
                <QRCode handleQR={handleQR} />
            </View>
            <View style={{ width: '100%', alignItems: 'flex-start', paddingLeft: 20, marginVertical: 10 }}>
                <Text style={{ fontSize: 15, color: '#112D4E', }}>Thông tin khách hàng</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.firstText}>Số CMND:
                            <Text style={styles.secondText}>  {info.IdentityId}</Text>
                </Text>
                <Text style={styles.firstText}>Họ và Tên:
                            <Text style={styles.secondText}>  {info.Fullname}</Text>
                </Text>
                <Text style={styles.firstText}>Ngày Sinh:
                            <Text style={styles.secondText}>  {info.Birthday}</Text>
                </Text>
                <Text style={styles.firstText}>Giới Tính:
                            <Text style={styles.secondText}>  {info.Sex}</Text>
                </Text>
                <Text style={styles.firstText}>Địa chỉ:
                            <Text style={styles.secondText}>  {info.Address}</Text>
                </Text>
                <Text style={styles.firstText}>Ngày cấp:
                            <Text style={styles.secondText}>  {info.GetDate}</Text>
                </Text>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                <Button title='Quay lại'
                    onPress={() => navigation.goBack()}
                    buttonStyle={{ backgroundColor: 'green', marginRight: 10 }}
                />
                <Button title='Xác nhận đăng ký'
                    onPress={hanldeSubmit}
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
    },
    info: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '95%',
        paddingLeft: 10
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: '#3F72AF',
        textTransform: "uppercase",
        paddingBottom: 20,
        paddingTop: 60
    },
    button: {
        backgroundColor: '#3F72AF',
        color: 'black',
        marginTop: 10,
        borderRadius: 10,
        width: 150,
        height: 40,
        marginTop: 30,
    },
    firstText: {
        fontSize: 20,
        paddingBottom: 5
    },
    secondText: {
        fontSize: 20,
        color: '#3F72AF',
    },
});