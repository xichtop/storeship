import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import deliveryAPI from '../api/deliveryAPI'
import storeAPI from '../api/storeAPI'
import { Tooltip } from 'react-native-elements';
import { formatDistance, formatRelative, addHours } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import numberWithCommas from '../utils/numberWithCommas'


export default function DeliveryDetail({ route, navigation }) {

    const token = useSelector(state => state.store.token);

    const { deliveryId } = route.params;

    const [delivery, setDelivery] = useState({
        Picture: 'https://hoanggiaps.com/wp-content/uploads/2019/01/thung-carton-nap-day.jpg',
        OrderDate: '2021-10-24T00:00:00.000Z'
    });

    useEffect(() => {
        const fetchDelivery = async () => {
            try {
                const temp = await deliveryAPI.getById(deliveryId, token);
                const temp2 = await storeAPI.getSizes(token);
                const temp3 = await storeAPI.getWeights(token);
                const size = temp2.find(item => item.Id === temp.GoodSize);
                const weight = temp3.find(item => item.Id === temp.GoodWeight);
                setDelivery({...temp, GoodSize: size.Description, GoodWeight: weight.Description});
            } catch (error) {
                console.log("Failed to fetch delivery: ", error);
            }
        }
        fetchDelivery();
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Thông tin đơn hàng</Text>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: '#112D4E', paddingVertical: 5 }}>{delivery.ShipType}</Text>
                <Text style={{ color: 'gray', fontSize: 16 }}>{delivery.ShipType === "Giao hàng nhanh" ? "GHN" : "GHTC"} - ĐH{delivery.DeliveryId}</Text>
                <View style={{ paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="wallet" size={20} color='#D98C00' />
                    <Text style={{ fontSize: 14, paddingLeft: 6 }}>Thu hộ COD: {numberWithCommas(parseInt(delivery.COD))} đ</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="timer" size={20} color='green' />
                    <Tooltip
                        popover={<Text style={{ fontSize: 16, color: '#F9F7F7' }}>{formatRelative(addHours(new Date(delivery.OrderDate), -7), new Date(), { locale: vi })}</Text>}
                        width={300}
                        backgroundColor='#3F72AF'
                    >
                        <Text style={{ fontSize: 14, paddingLeft: 6 }}>Ngày đặt hàng: {formatDistance(addHours(new Date(delivery.OrderDate), -7), new Date(), { locale: vi })} trước</Text>
                    </Tooltip>
                </View>

            </View>
            <View style={styles.box}>
                <Text style={styles.title}>Thông tin người nhận</Text>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: '#112D4E', paddingVertical: 5 }}>{delivery.RecieverName}</Text>
                <View style={{ paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="call" size={20} color='#D98C00' />
                    <Text style={{ fontSize: 14, paddingLeft: 6 }}>Số điện thoại: {delivery.RecieverPhone}</Text>
                </View>
                <View style={{ paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="golf" size={20} color='green' />
                    <Text style={{ fontSize: 14, paddingLeft: 6 }}>Địa chỉ: {delivery.AddressDetail}, {delivery.WardName},</Text>
                </View>
                <Text style={{ fontSize: 14, paddingLeft: 26, marginTop: -3 }}>{delivery.DistrictName}, {delivery.ProvinceName}</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>Thông tin hàng hóa</Text>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: '#112D4E', paddingBottom: 10 }}>{delivery.GoodName}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{ alignItems: 'center', borderWidth: 1, borderColor: '#112D4E', borderRadius: 10 }}>
                        <Image source={{ uri: `${delivery.Picture}` }} style={styles.photo} />
                    </View>
                    <View style={{ paddingLeft: 10, justifyContent: 'space-between', }}>
                        <View style={{ paddingVertical: 3, flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="cube" size={20} color='#D98C00' />
                            <Text style={{ fontSize: 14, paddingLeft: 6 }}>Loại hàng: {delivery.GoodType}</Text>
                        </View>
                        <View style={{ paddingVertical: 3, flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="barbell-sharp" size={20} color='green' />
                            <Text style={{ fontSize: 14, paddingLeft: 6 }}>Cân nặng: {delivery.GoodWeight}</Text>
                        </View>
                        <View style={{ paddingVertical: 3, flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="expand-sharp" size={20} color='#FF577F' />
                            <Text style={{ fontSize: 14, paddingLeft: 6 }}>Kích thước: {delivery.GoodSize}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>Trạng thái đơn hàng</Text>
                {delivery.Status === 'Ordered' ?
                    <Text>Chờ tiếp nhận</Text> : <View></View>}
                {delivery.Status === 'Canceled' ?
                    <Text>Đã hủy</Text> : <View></View>}
                {delivery.Status !== 'Ordered' && delivery.Status !== 'Canceled' ?
                    <Button title='Trạng thái chi tiết'
                        onPress={() => navigation.navigate('Step', {
                            DeliveryId: delivery.DeliveryId,
                        })}
                        buttonStyle={{ backgroundColor: '#112D4E', borderRadius: 10 }}
                    />
                    :
                    <View></View>
                }

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E8EAE6',
        height: '90%',
        alignItems: 'center',
        paddingTop: 5
    },
    box: {
        borderRadius: 15,
        paddingBottom: 10,
        paddingLeft: 10,
        backgroundColor: 'white',
        width: '92%',
        marginVertical: 3,
    },
    title: {
        paddingVertical: 3,
        fontSize: 18,
        color: '#112D4E',
    },
    photo: {
        height: 80,
        width: 80,
        resizeMode: 'contain',
        borderRadius: 10
    }
})
