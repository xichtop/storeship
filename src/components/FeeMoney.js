import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Text, Alert, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements'
import { Table, Row } from 'react-native-table-component';
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import numberWithCommas from '../utils/numberWithCommas'
import feeshipAPI from '../api/feeshipAPI';
import { showMessage } from "react-native-flash-message";
import { SearchBar } from 'react-native-elements';
const tableHead = ['Mã ĐH', 'Ngày đặt', 'Ngày giao', 'Phí GH', 'Trạng thái'];
const widthArr = [44, 90, 90, 70, 120];
const DATA = [
    ['ĐH1', '0377025912', '26-06-1999', '10000đ', 'Đã thanh toán'],
    ['ĐH2', '0377025912', '26-06-1999', '10000đ', 'Đã thanh toán'],
    ['ĐH3', '0377025912', '26-06-1999', '10000đ', 'Đã thanh toán'],
]

export default function FastMoney() {

    const StoreId = useSelector(state => state.store.store.StoreId);

    const token = useSelector(state => state.store.token);

    const [data, setData] = useState(DATA);

    const [dataSearch, setDataSearch] = useState([]);

    const [total, setTotal] = useState(0);

    const [totalPay, setTotalPay] = useState(0);

    const [loading, setLoading] = useState(false);

    const [loadingPay, setLoadingPay] = useState(false);

    const [search, setSearch] = useState('');

    const updateSearch = (search) => {
        setSearch(search);
        const temp = data.filter(function (item) {
            return item[0].toString().indexOf(search) !== -1;
        })
        setDataSearch(temp);
    }

    const fetchStatistic = async () => {
        try {
            const list = await feeshipAPI.getAll(StoreId, token);
            var tempList = [];
            var tempTotalPay = 0;
            var tempTotal = 0;
            list.forEach(item => {
                tempList.push([
                    item.DeliveryId,
                    format(new Date(item.OrderDate.slice(0, 10)), 'dd-MM-yyyy'),
                    format(new Date(item.DeliveryDate.slice(0, 10)), 'dd-MM-yyyy'),
                    numberWithCommas(item.FeeShip),
                    item.Status
                ])
                if (item.Status === 'Đã thanh toán') {
                    tempTotalPay += parseInt(item.FeeShip);
                    tempTotal += parseInt(item.FeeShip);
                } else {
                    tempTotal += parseInt(item.FeeShip);
                }
            })
            setData(tempList);
            setDataSearch(tempList);
            setTotalPay(tempTotalPay);
            setTotal(tempTotal);
        } catch (error) {
            console.log('Fetch get all fee by store failed', error);
        }
        setLoading(false);
        setLoadingPay(false);
    }

    const handlePay = () => {
        const fetchPayFee = async () => {
            var deliveries = [];
            data.forEach(item => {
                deliveries.push({
                    DeliveryId: item[0],
                    Money: parseInt(item[3]) * 1000,
                    Status: item[4],
                })
            })
            const item = {
                Deliveries: deliveries,
                StoreId: StoreId
            }
            var result = null;
            try {
                result = await feeshipAPI.payFeeStore(item, token);
            } catch (error) {
                console.log("Failed to fetch pay fee store: ", error);
            }

            if (result.successful === true) {
                setTimeout(() => {
                    setLoadingPay(false);
                    showMessage({
                        message: "Wonderfull!!!",
                        description: "Thanh toán COD thành công",
                        type: "success",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                }, 3000);
            } else {
                setTimeout(() => {
                    setLoadingPay(false);
                    showMessage({
                        message: "Thanh toán COD thất bại",
                        description: "Vui lòng thử lại sau",
                        type: "danger",
                        duration: 3000,
                        icon: 'auto',
                        floating: true,
                    });
                }, 3000);
            }
        }
        if (total - totalPay === 0) {
            Alert.alert('Bạn đã thanh toán toàn bộ tiền COD!!!');
        } else {
            Alert.alert(
                "Thanh Toán Phí Giao Hàng",
                "Bạn có chắc chắn muốn thanh toán toàn bộ phí giao hàng còn lại không?",
                [
                    {
                        text: "Không",
                        onPress: () => { },
                        style: "destructive",
                    },
                    {
                        text: "Có",
                        onPress: () => {
                            setLoadingPay(true);
                            fetchPayFee();
                            handleRefresh(); // ghi chú
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

    const handleRefresh = () => {
        setLoading(true);
        fetchStatistic();
    }

    useEffect(() => {
        setLoading(true);
        fetchStatistic();
    }, [])

    return (
        <View>
            <SearchBar
                placeholder="Nhập mã đơn hàng..."
                onChangeText={updateSearch}
                value={search}
                lightTheme
                keyboardType='phone-pad'
                containerStyle={{ backgroundColor: '#F9F7F7', height: 48 }}
                inputContainerStyle={{ backgroundColor: '#DBE2EF', height: 24 }}
            />
            <View style={styles.container}>
                {loading === true ?
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                        <View style={{ marginHorizontal: 5 }} >
                            <ActivityIndicator size="small" color="#515E63" />
                        </View>
                        <View style={{ marginHorizontal: 5 }} >
                            <ActivityIndicator size="small" color="#57837B" />
                        </View>
                        <View style={{ marginHorizontal: 5 }} >
                            <ActivityIndicator size="small" color="#C9D8B6" />
                        </View>

                    </View>
                    :
                    <View></View>
                }
                <ScrollView horizontal={true}>
                    <View>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#112D4E' }}>
                            <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={{ ...styles.text, color: 'white' }} />
                        </Table>
                        <ScrollView style={styles.dataWrapper}>
                            <Table borderStyle={{ borderWidth: 1, borderColor: '#112D4E' }}>
                                {
                                    dataSearch.map((rowData, index) => (
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
                <View style={{ marginLeft: 10 }}>
                    <Button title='Thanh toán'
                        onPress={handlePay}
                        buttonStyle={styles.button}
                        loading={loadingPay}
                    />
                    <Button title='Refresh'
                        onPress={handleRefresh}
                        buttonStyle={{ ...styles.button, backgroundColor: 'green' }}
                        loading={loading} />
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.textmoney}>Tổng tiền: {numberWithCommas(total)} đ</Text>
                    <Text style={styles.textmoney}>Đã thanh toán: {numberWithCommas(totalPay)} đ</Text>
                    <Text style={styles.textmoney}>Còn lại: {numberWithCommas(total - totalPay)} đ</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { backgroundColor: '#fff', height: 480 },
    header: { height: 50, backgroundColor: '#112D4E' },
    text: { textAlign: 'center', fontWeight: '300', },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#C9D8B6' },
    money: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, paddingRight: 10 },
    textmoney: { fontSize: 16, paddingBottom: 6 },
    button: {
        marginBottom: 10,
        borderRadius: 10,
    }
});