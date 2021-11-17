import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, StyleSheet, StatusBar } from 'react-native'
import { Button } from 'react-native-elements'
import { PieChart, } from "react-native-chart-kit";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { addDays } from 'date-fns'
import deliveryAPI from '../api/deliveryAPI'
import { useSelector } from 'react-redux'

const DATA = [
    { name: 'Ordered', mount: 100, color: '#435560', legendFontColor: '#435560', legendFontSize: 0 },
    { name: 'Delivering', mount: 200, color: '#6E7C7C', legendFontColor: '#6E7C7C', legendFontSize: 0 },
    { name: 'Delivered', mount: 10, color: '#92967D', legendFontColor: '#92967D', legendFontSize: 0 },
    { name: 'Canceled', mount: 10, color: '#C8C6A7', legendFontColor: '#C8C6A7', legendFontSize: 0 },
]

export default function Home() {

    const token = useSelector(state => state.store.token);

    const storeId = useSelector(state => state.store.store.StoreId);

    const [firstDate, setFirstDate] = useState(addDays(new Date(), -30));

    const [lastDate, setLastDate] = useState(addDays(new Date(), 1));

    const [data, setData] = useState(DATA);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getListStatistic = async () => {
            const item = {
                FirstDate: firstDate,
                LastDate: lastDate,
                StoreId: storeId
            }
            try {
                const temp = await deliveryAPI.statistic(item, token);
                let datas = [];
                DATA.forEach((item) => {
                    const indexFind = temp.findIndex(i => i.Status === item.name);
                    if (indexFind !== -1) {
                        datas.push({
                            ...item,
                            mount: temp[indexFind].Mount,
                        })
                    } else {
                        datas.push({
                            ...item,
                            mount: 0,
                        })
                    }
                })
                setData(datas);
            } catch (error) {
                console.log("Failed to fetch statistic list: ", error);
            }
        }
        getListStatistic();
    }, [])

    const onFirstDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || firstDate;
        setFirstDate(currentDate);
    };

    const onLastDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || lastDate;
        setLastDate(currentDate);
    };

    const hanldeFilter = () => {
        const getListStatistic = async () => {
            const item = {
                FirstDate: firstDate,
                LastDate: addDays(lastDate, 1),
                StoreId: storeId
            }
            try {
                const temp = await deliveryAPI.statistic(item, token);
                let datas = [];
                // temp.forEach((item, index) => {
                //     datas.push({
                //         ...DATA[index],
                //         mount: item.Mount,
                //     })
                // })
                DATA.forEach((item) => {
                    const indexFind = temp.findIndex(i => i.Status === item.name);
                    if (indexFind !== -1) {
                        datas.push({
                            ...item,
                            mount: temp[indexFind].Mount,
                        })
                    } else {
                        datas.push({
                            ...item,
                            mount: 0,
                        })
                    }
                })
                setData(datas);
            } catch (error) {
                console.log("Failed to fetch statistic list: ", error);
            }
        }
        setLoading(true);
        setTimeout(() => {
            getListStatistic();
            setLoading(false);
        }, 1000)
    }

    return (
        <View style={{ backgroundColor: "white", height: '100%' }}>
            <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
            <Text style={{ fontSize: 22, color: '#112D4E', fontWeight: 'bold', paddingVertical: 20, alignSelf: 'center' }}>Thống Kê Số Lượng Đơn Hàng</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10, justifyContent: 'center', paddingBottom: 10 }} >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>Từ ngày: </Text>
                    <RNDateTimePicker
                        testID="dateTimePicker1"
                        value={firstDate}
                        mode='date'
                        display="default"
                        onChange={onFirstDateChange}
                        locale='vi-VN'
                        style={{ width: 100 }}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                    <Text>Đến ngày: </Text>
                    <RNDateTimePicker
                        testID="dateTimePicker2"
                        value={lastDate}
                        mode='date'
                        display="default"
                        onChange={onLastDateChange}
                        locale='vi-VN'
                        style={{ width: 100 }}
                    />
                </View>
                <Button title='Lọc'
                    onPress={hanldeFilter}
                    titleStyle={{ fontSize: 12 }}
                    buttonStyle={{ width: 50, borderRadius: 6 }}
                    loading={loading} 
                />
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                <View style={styles.container}>
                    <Ionicons name="rocket" size={50} color='#435560' />
                    <View style={styles.box}>
                        <Text style={styles.title}>Lấy hàng</Text>
                        <Text style={styles.number}>{data[0].mount}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <Ionicons name="car-sport" size={50} color='#6E7C7C' />
                    <View style={styles.box}>
                        <Text style={styles.title}>Đang giao</Text>
                        <Text style={styles.number}>{data[1].mount}</Text>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                <View style={styles.container}>
                    <Ionicons name="checkmark-circle" size={50} color='#92967D' />
                    <View style={styles.box}>
                        <Text style={styles.title}>Đã giao</Text>
                        <Text style={styles.number}>{data[2].mount}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <Ionicons name="backspace" size={50} color='#C8C6A7' />
                    <View style={styles.box}>
                        <Text style={styles.title}>Đã hủy</Text>
                        <Text style={styles.number}>{data[3].mount}</Text>
                    </View>
                </View>
            </View>
            <Text style={{ fontSize: 22, color: '#112D4E', fontWeight: 'bold', alignSelf: 'center', paddingVertical: 20 }}>Biểu Đồ</Text>
            <View style={styles.chart}>
                <PieChart
                    data={data}
                    width={Dimensions.get("window").width}
                    height={250}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(17, 45, 78, ${opacity})`,
                        style: {
                            marginLeft: 100
                        }
                    }}
                    accessor="mount"
                    paddingLeft="95"
                    absolute
                    hasLegend={false}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F7F7',
        height: 100,
        flex: 1,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: '#14279B',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.5,
        elevation: 5
    },
    box: {
        paddingLeft: 10, alignItems: 'center'
    },
    title: {
        color: '#3F72AF',
        paddingBottom: 5,
        fontWeight: 'bold'
    },
    number: {
        fontSize: 24,
        color: '#112D4E',
        fontWeight: 'bold'
    },
    chart: {

        backgroundColor: '#F9F7F7',
        borderRadius: 10,
        marginHorizontal: 10,
        shadowColor: '#14279B',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.5,
        elevation: 5
    }
})