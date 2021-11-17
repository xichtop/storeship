import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Button } from 'react-native-elements'
import { Table, TableWrapper, Row } from 'react-native-table-component';
import { useSelector } from 'react-redux'
import { format, addDays } from 'date-fns'
import numberWithCommas from '../utils/numberWithCommas'
import paymentApi from '../api/paymentAPI';
import RNDateTimePicker from '@react-native-community/datetimepicker';
const tableHead = ['Mã ĐH', 'SĐT', 'Ngày đặt', 'COD', 'Trạng thái'];
const widthArr = [48, 94, 90, 66, 118];
const DATA = [
    ['ĐH1', '0377025912', '26-06-1999', '10000đ', 'Đã thanh toán'],
    ['ĐH2', '0377025912', '26-06-1999', '10000đ', 'Đã thanh toán'],
    ['ĐH3', '0377025912', '26-06-1999', '10000đ', 'Đã thanh toán'],
]

export default function Money() {

    const storeId = useSelector(state => state.store.store.StoreId);

    const token = useSelector(state => state.store.token);

    const [data, setData] = useState(DATA);

    const [total, setTotal] = useState(0);

    const [totalPay, setTotalPay] = useState(0);

    const [firstDate, setFirstDate] = useState(addDays(new Date(), -30));

    const [lastDate, setLastDate] = useState(addDays(new Date(), 1));

    const [loading, setLoading] = useState(false);

    const onFirstDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || firstDate;
        setFirstDate(currentDate);
    };

    const onLastDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || lastDate;
        setLastDate(currentDate);
    };

    const hanldeFilter = () => {
        const fetchStatistic = async () => {
            try {
                const item = {
                    FirstDate: firstDate,
                    LastDate: lastDate,
                    StoreId: storeId
                }
                const list = await paymentApi.statistic(item, token);
                var tempList = [];
                var tempTotalPay = 0;
                var tempTotal = 0;
                list.forEach(item => {
                    tempList.push([
                        item.DeliveryId,
                        item.Phone,
                        format(new Date(item.OrderDate), 'dd-MM-yyyy'),
                        numberWithCommas(item.COD),
                        item.Status
                    ])
                    if (item.Status === 'Đã thanh toán') {
                        tempTotalPay += parseInt(item.COD);
                        tempTotal += parseInt(item.COD);
                    } else {
                        tempTotal += parseInt(item.COD);
                    }
                })
                setData(tempList);
                setTotalPay(tempTotalPay);
                setTotal(tempTotal);
            } catch (error) {
                console.log('Fetch Statistic failed', error);
            }
        }
        setLoading(true);
        setTimeout(() => {
            fetchStatistic();
            setLoading(false);
        }, 1000)
    }

    useEffect(() => {
        const fetchStatistic = async () => {
            try {
                const item = {
                    FirstDate: firstDate,
                    LastDate: lastDate,
                    StoreId: storeId
                }
                const list = await paymentApi.statistic(item, token);
                var tempList = [];
                var tempTotalPay = 0;
                var tempTotal = 0;
                list.forEach(item => {
                    tempList.push([
                        item.DeliveryId,
                        item.Phone,
                        format(new Date(item.OrderDate), 'dd-MM-yyyy'),
                        numberWithCommas(item.COD),
                        item.Status
                    ])
                    if (item.Status === 'Đã thanh toán') {
                        tempTotalPay += parseInt(item.COD);
                        tempTotal += parseInt(item.COD);
                    } else {
                        tempTotal += parseInt(item.COD);
                    }
                })
                setData(tempList);
                setTotalPay(tempTotalPay);
                setTotal(tempTotal);
            } catch (error) {
                console.log('Fetch Statistic failed', error);
            }
        }
        fetchStatistic();
    }, [])

    return (
        <View>
            <Text style={{ fontSize: 18, color: '#112D4E', fontWeight: 'bold', paddingVertical: 10, alignSelf: 'center' }}>Thống Kê Đơn Hàng</Text>
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
            <View style={styles.container}>
                <ScrollView horizontal={true}>
                    <View>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#112D4E' }}>
                            <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={{ ...styles.text, color: 'white' }} />
                        </Table>
                        <ScrollView style={styles.dataWrapper}>
                            <Table borderStyle={{ borderWidth: 1, borderColor: '#112D4E' }}>
                                {
                                    data.map((rowData, index) => (
                                        <Row
                                            key={index}
                                            data={rowData}
                                            widthArr={widthArr}
                                            style={[styles.row, index % 2 && { backgroundColor: '#F1ECC3' }]}
                                            textStyle={styles.text}
                                        />
                                    ))
                                }
                            </Table>
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
            <View style={styles.money}>
                <Text style={styles.textmoney}>Tổng tiền: {numberWithCommas(total)} đ</Text>
                <Text style={styles.textmoney}>Đã thanh toán: {numberWithCommas(totalPay)} đ</Text>
                <Text style={styles.textmoney}>Còn lại: {numberWithCommas(total - totalPay)} đ</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#fff', height: 492 },
    header: { height: 50, backgroundColor: '#112D4E' },
    text: { textAlign: 'center', fontWeight: '300', },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#C9D8B6' },
    money: { alignItems: 'flex-end', paddingTop: 10, paddingRight: 10 },
    textmoney: { fontSize: 16, paddingBottom: 5 }
});