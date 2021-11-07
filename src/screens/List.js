import React, { useState, useEffect } from 'react';
import { LayoutAnimation, SafeAreaView, StyleSheet, View, Text, RefreshControl, StatusBar } from 'react-native';
import {
    SwipeableFlatList,
    SwipeableQuickActionButton,
    SwipeableQuickActions,
} from 'react-native-swipe-list';
import { Button, Tooltip } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import deliveryAPI from '../api/deliveryAPI';
import { SearchBar } from 'react-native-elements';
import { formatDistance, formatRelative, addHours } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useSelector } from 'react-redux'

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
            <SwipeableFlatList
                data={dataSearch}
                renderItem={({ item }) =>
                    <View
                        style={{
                            width: '100%',
                            backgroundColor: '#F9F7F7',
                            borderColor: '#3F72AF',
                            borderWidth: 1,
                            marginBottom: 10,
                            padding: 10
                        }}
                    >
                        <Text style={{ fontSize: 20, fontWeight: "bold", color: '#112D4E' }}>ĐH{item.DeliveryId}/{item.ShipType === "Giao hàng nhanh" ? "GHN" : "GHTC"} : {item.RecieverName}</Text>
                        <Text style={{ fontSize: 16, color: '#3F72AF' }}>Địa chỉ: {item.AddressDetail}, {item.WardName}, {item.DistrictName}, {item.ProvinceName}</Text>
                        <Text style={{ fontSize: 16, color: '#3F72AF' }}>Số điện thoại: {item.RecieverPhone}</Text>
                        <Text style={{ fontSize: 16, color: '#3F72AF' }}>COD: {item.COD}đ</Text>
                        <Tooltip
                            popover={<Text style={{ fontSize: 16, color: '#F9F7F7' }}>{formatRelative(addHours(new Date(item.OrderDate), -7), new Date(), { locale: vi })}</Text>}
                            width={300}
                            backgroundColor='#3F72AF'
                        >
                            <Text style={{ fontSize: 16 }}>{formatDistance(addHours(new Date(item.OrderDate), -7), new Date(), { locale: vi })}</Text>
                        </Tooltip>
                        {/* {item.Status === 'Ordered' ?
                            <View style={{ alignItems: 'center', paddingTop: 20 }}>
                                <Button title='Hủy Đơn Hàng'
                                    onPress={handleCancel} />
                            </View>
                            :
                            <View></View>
                        } */}
                    </View>
                }
                keyExtractor={item => item.DeliveryId.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                // renderLeftActions={({ item }) => (
                //     <SwipeableQuickActions>
                //     </SwipeableQuickActions>
                // )}
                renderRightActions={({ item }) => (
                    <SwipeableQuickActions>
                        <SwipeableQuickActionButton
                            onPress={() => {
                                LayoutAnimation.configureNext(
                                    LayoutAnimation.Presets.easeInEaseOut,
                                );
                                // setData(data.filter(value => value.id !== item.id));
                                navigation.navigate('Detail', {
                                    deliveryId: item.DeliveryId,
                                })
                            }}
                            text="Chi tiết"
                            textStyle={{ fontWeight: 'bold', color: '#F9F7F7' }}
                            style={{ backgroundColor: '#3F72AF', justifyContent: 'center', width: 120, height: '94%', }}
                        />
                    </SwipeableQuickActions>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '87%',
        justifyContent: 'center',
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