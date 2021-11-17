import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, RefreshControl, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { Button, Tooltip } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import deliveryAPI from '../api/deliveryAPI';
import { SearchBar } from 'react-native-elements';
import { formatDistance, formatRelative, addHours } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useSelector } from 'react-redux'
import numberWithCommas from '../utils/numberWithCommas'

export default function List({ navigation }) {

    const token = useSelector(state => state.store.token);

    const storeId = useSelector(state => state.store.store.StoreId);

    const [data, setData] = useState([]);

    const [dataSearch, setDataSearch] = useState([]);

    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState('');

    const [colors, setColors] = useState([
        { type: 'solid', color: '#F9F7F7' },
        { type: 'outline', color: '#3F72AF' },
        { type: 'outline', color: '#3F72AF' },
        { type: 'outline', color: '#3F72AF' }
    ]);

    const updateSearch = (search) => {
        setSearch(search);
        const temp = data.filter(function (item) {
            return item.RecieverPhone.indexOf(search) !== -1
        })
        setDataSearch(temp);
    }

    useEffect(() => {
        const fetchListDeleiveries = async () => {
            try {
                const deliveries = await deliveryAPI.getByStoreandStatus(storeId, 'Ordered', token);
                setData(deliveries);
                setDataSearch(deliveries);
                // console.log(formatRelative(addHours(new Date(deliveries[2].OrderDate), -7), new Date(), {locale: vi}));
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        fetchListDeleiveries();
    }, [])

    const handleOrdered = () => {
        const fetchListDeleiveries = async () => {
            try {
                const deliveries = await deliveryAPI.getByStoreandStatus(storeId, 'Ordered', token);
                setData(deliveries);
                setDataSearch(deliveries);
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        fetchListDeleiveries();
        setColors([
            { type: 'solid', color: '#F9F7F7' },
            { type: 'outline', color: '#3F72AF' },
            { type: 'outline', color: '#3F72AF' },
            { type: 'outline', color: '#3F72AF' }
        ])
    }
    const handleDelivering = () => {
        const fetchListDeleiveries = async () => {
            try {
                const deliveries = await deliveryAPI.getByStoreandStatus(storeId, 'Delivering', token);
                setData(deliveries);
                setDataSearch(deliveries);
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        fetchListDeleiveries();
        setColors([
            { type: 'outline', color: '#3F72AF' },
            { type: 'solid', color: '#F9F7F7' },
            { type: 'outline', color: '#3F72AF' },
            { type: 'outline', color: '#3F72AF' }
        ])
    }
    const handleDelivered = () => {
        const fetchListDeleiveries = async () => {
            try {
                const deliveries = await deliveryAPI.getByStoreandStatus(storeId, 'Delivered', token);
                setData(deliveries);
                setDataSearch(deliveries);
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        fetchListDeleiveries();
        setColors([
            { type: 'outline', color: '#3F72AF' },
            { type: 'outline', color: '#3F72AF' },
            { type: 'solid', color: '#F9F7F7' },
            { type: 'outline', color: '#3F72AF' }
        ])
    }
    const handleCanceled = () => {
        const fetchListDeleiveries = async () => {
            try {
                const deliveries = await deliveryAPI.getByStoreandStatus(storeId, 'Canceled', token);
                setData(deliveries);
                setDataSearch(deliveries);
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        fetchListDeleiveries();
        setColors([
            { type: 'outline', color: '#3F72AF' },
            { type: 'outline', color: '#3F72AF' },
            { type: 'outline', color: '#3F72AF' },
            { type: 'solid', color: '#F9F7F7' },
        ])
    }

    const onRefresh = () => {
        // const index = colors.findIndex(c => c.type === 'solid');
        let newIndex = 0;
        colors.forEach((c, index) => {
            if (c.type === 'solid') newIndex = index
        })
        let status = '';
        if (newIndex === 0) { status = 'Ordered' }
        else if (newIndex === 1) { status = 'Delivering' }
        else if (newIndex === 2) { status = 'Delivered' }
        else if (newIndex === 3) { status = 'Canceled' }
        const fetchListDeleiveries = async () => {
            try {
                const deliveries = await deliveryAPI.getByStoreandStatus(storeId, status, token);
                setData(deliveries);
                setDataSearch(deliveries);
            } catch (error) {
                console.log("Failed to fetch provinces list: ", error);
            }
        }
        setRefreshing(true);
        fetchListDeleiveries();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000)
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                <Button
                    icon={<Icon name="rocket" size={15} color={colors[0].color} />}
                    title="Lấy Hàng"
                    type={colors[0].type}
                    titleStyle={{ paddingLeft: 5, fontSize: 16, color: `${colors[0].color}` }}
                    onPress={handleOrdered}
                />
                <Button
                    icon={<Icon name="car-sport" size={15} color={colors[1].color} />}
                    title="Đang Giao"
                    type={colors[1].type}
                    titleStyle={{ paddingLeft: 5, fontSize: 16, color: `${colors[1].color}` }}
                    onPress={handleDelivering}
                />
                <Button
                    icon={<Icon name="checkmark-circle" size={15} color={colors[2].color} />}
                    title="Đã Giao"
                    type={colors[2].type}
                    titleStyle={{ paddingLeft: 5, fontSize: 16, color: `${colors[2].color}` }}
                    onPress={handleDelivered}
                />
                <Button
                    icon={<Icon name="backspace" size={15} color={colors[3].color} />}
                    title="Đã Hủy"
                    type={colors[3].type}
                    titleStyle={{ paddingLeft: 5, fontSize: 16, color: `${colors[3].color}` }}
                    onPress={handleCanceled}
                />
            </View>
            <SearchBar
                placeholder="Tìm kiếm đơn hàng theo số điện thoại..."
                onChangeText={updateSearch}
                value={search}
                lightTheme
                keyboardType='phone-pad'
                containerStyle={{ backgroundColor: '#F9F7F7', height: 48 }}
                inputContainerStyle={{ backgroundColor: '#DBE2EF', height: 24 }}
            />
            <View style={{ alignItems: 'center', width: '100%', paddingTop: 10}}>
                <FlatList
                    data={dataSearch}
                    renderItem={({ item }) =>
                        <View
                            style={{
                                width: '96%',
                                backgroundColor: 'white',
                                borderRadius: 15,
                                marginBottom: 10,
                                paddingHorizontal: 20,
                                alignSelf: 'center'
                            }}
                        >
                            <View style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: 'gray', fontSize: 16 }}>{item.ShipType === "Giao hàng nhanh" ? "GHN" : "GHTC"} - ĐH{item.DeliveryId}</Text>
                                <View style={{
                                    backgroundColor: item.ShipType === "Giao hàng nhanh" ? "#1C7947" : "#112D4E",
                                    borderRadius: 15, paddingHorizontal: 10, paddingVertical: 5
                                }}>
                                    <Text style={{ color: '#F9F7F7', fontSize: 14 }}>{item.ShipType}</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: "bold", color: '#112D4E' }}>{item.RecieverName} | {item.RecieverPhone}</Text>
                            <View style={{ paddingVertical: 6, flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="golf" size={20} color='#D98C00' />
                                <Text style={{ fontSize: 14, color: 'gray', paddingLeft: 10 }}>{item.AddressDetail}, {item.WardName}, {item.DistrictName}, {item.ProvinceName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="timer" size={20} color='green' />
                                <Tooltip
                                    popover={<Text style={{ fontSize: 16, color: '#F9F7F7' }}>{formatRelative(addHours(new Date(item.OrderDate), -7), new Date(), { locale: vi })}</Text>}
                                    width={300}
                                    backgroundColor='#3F72AF'
                                >
                                    <Text style={{ fontSize: 14, paddingLeft: 10 }}>{formatDistance(addHours(new Date(item.OrderDate), -7), new Date(), { locale: vi })} trước</Text>
                                </Tooltip>
                            </View>
                            <View style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: 'gray', fontSize: 16 }}>Thu hộ COD</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 16, color: '#112D4E', fontWeight: 'bold', paddingRight: 10 }}>{numberWithCommas(parseInt(item.COD))} đ</Text>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Detail', {
                                            deliveryId: item.DeliveryId
                                        })}
                                    >
                                        <Icon name="chevron-forward" size={20} color='#112D4E' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    }
                    keyExtractor={item => item.DeliveryId.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '74%',
        backgroundColor: '#E8EAE6',
    },
    select: {
        fontSize: 20,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#3F72AF',
        borderRadius: 4,
        color: '#3F72AF',
        paddingRight: 30,
    },
})