import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import deliveryAPI from '../api/deliveryAPI'
import { Tooltip } from 'react-native-elements';
import { showMessage, hideMessage } from "react-native-flash-message";
import { formatDistance, formatRelative, addHours } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useSelector } from 'react-redux';
import StepIndicator from 'react-native-step-indicator';
const labels = ["Lấy hàng", "Đang giao", "Đã giao", "Đã hủy"];
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


export default function DeliveryDetail({ route, navigation }) {

    const token = useSelector(state => state.store.token);

    const { deliveryId } = route.params;

    const [step, setStep] = useState(0);

    const [delivery, setDelivery] = useState({
        Picture: 'https://hoanggiaps.com/wp-content/uploads/2019/01/thung-carton-nap-day.jpg',
        OrderDate: '2021-10-24T00:00:00.000Z'
    });

    useEffect(() => {
        const fetchDelivery = async () => {
            try {
                const temp = await deliveryAPI.getById(deliveryId, token);
                setDelivery(temp);
                if (temp.Status === 'Ordered') setStep(0);
                else if (temp.Status === 'Delivering') setStep(1);
                else if (temp.Status === 'Delivered') setStep(2);
                else if (temp.Status === 'Canceled') setStep(3);
            } catch (error) {
                console.log("Failed to fetch delivery: ", error);
            }
        }
        fetchDelivery();
    }, [])

    const handleCancel = () => {
        const fetchCancel = async () => {
            var item = {
                DeliveryId: deliveryId,
                NewStatus: 'Canceled',
            }
            var result = null;
            try {
                result = await deliveryAPI.updateStatus(item, token);

            } catch (error) {
                console.log("Failed to fetch deliveries: ", error);
            }

            if (result.successful === true) {
                showMessage({
                    message: "Wonderfull!!!",
                    description: "Hủy đơn hàng thành công",
                    type: "success",
                    duration: 1500,
                    icon: 'auto',
                    floating: true,
                });
                setStep(3);
                setDelivery({
                    ...delivery,
                    Status: 'Canceled'
                })
            } else {
                showMessage({
                    message: "Hủy đơn hàng thất bại",
                    description: "Vui lòng thử lại sau",
                    type: "danger",
                    duration: 1500,
                    icon: 'auto',
                    floating: true,
                });
            }
        }

        fetchCancel();
    }

    return (
        <View>
            <View style={styles.box}>
                <Text style={styles.title}>Thông tin đơn hàng</Text>
                <Text style={styles.firstText}>Mã đơn hàng:
                        <Text style={styles.secondText}> ĐH{delivery.DeliveryId}/{delivery.ShipType === 'Giao hàng nhanh' ? 'GHN' : 'GHTC'}</Text>
                </Text>
                <Text style={styles.firstText}>Loại giao hàng:
                        <Text style={styles.secondText}> {delivery.ShipType}</Text>
                </Text>
                <Text style={styles.firstText}>COD:
                        <Text style={styles.secondText}> {delivery.COD}đ</Text>
                </Text>
                <Tooltip
                    popover={<Text style={{ fontSize: 16, color: '#F9F7F7' }}>{formatRelative(addHours(new Date(delivery.OrderDate), -7), new Date(), { locale: vi })}</Text>}
                    width={300}
                    backgroundColor='#3F72AF'
                >
                    <Text style={{ fontSize: 16 }}>{formatDistance(addHours(new Date(delivery.OrderDate), -7), new Date(), { locale: vi })}</Text>
                </Tooltip>

            </View>
            <View style={styles.box}>
                <Text style={styles.title}>Thông tin người nhận</Text>
                <Text style={styles.firstText}>Tên người nhận:
                        <Text style={styles.secondText}> {delivery.RecieverName}</Text>
                </Text>
                <Text style={styles.firstText}>Số điện thoại:
                        <Text style={styles.secondText}> {delivery.RecieverPhone}</Text>
                </Text>
                <Text style={styles.firstText}>Địa chỉ:
                        <Text style={styles.secondText}>{delivery.AddressDetail}, {delivery.WardName}, {delivery.DistrictName}, {delivery.ProvinceName}</Text>
                </Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>Thông tin hàng hóa</Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ alignItems: 'center', paddingBottom: 10 }}>
                        <Image source={{ uri: `${delivery.Picture}` }} style={styles.photo} />
                    </View>
                    <View style={{ paddingLeft: 10, justifyContent: 'space-between', paddingVertical: 5, }}>
                        <Text style={styles.firstText}>Tên hàng:
                            <Text style={styles.secondText}> {delivery.GoodName}</Text>
                        </Text>
                        <Text style={styles.firstText}>Loại hàng:
                            <Text style={styles.secondText}> {delivery.GoodType}</Text>
                        </Text>
                        <Text style={styles.firstText}>Cân nặng:
                            <Text style={styles.secondText}> {delivery.GoodWeight} Kg</Text>
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>Trạng thái đơn hàng</Text>
                <StepIndicator
                    customStyles={customStyles}
                    stepCount={4}
                    currentPosition={step}
                    labels={labels}
                />
            </View>
            {delivery.Status === 'Ordered' ?
                <View style={{ alignItems: 'center', paddingTop: 20 }}>
                    <Button title='Hủy Đơn Hàng'
                        onPress={handleCancel} />
                </View>
                :
                <View></View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    box: {
        borderBottomWidth: 1,
        borderBottomColor: '#3F72AF',
        paddingBottom: 10,
        paddingLeft: 10
    },
    title: {
        paddingVertical: 10,
        fontSize: 18,
        color: '#3F72AF'
    },
    firstText: {
        fontSize: 20,
    },
    secondText: {
        fontSize: 20,
        color: '#112D4E',
        fontWeight: 'bold'
    },
    photo: {
        height: 100,
        width: 100,
        resizeMode: 'contain',
        borderRadius: 5
    }
})
