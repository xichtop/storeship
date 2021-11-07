import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { Switch } from 'react-native-elements';
export default function Profile() {

    const store = useSelector(state => state.store.store);

    return (
        <View style={{ BackgroundColor: '#F9F7F7' }}>
            <View style={{ flexDirection: 'row', padding: 10, backgroundColor: 'white', alignItems: 'center', paddingHorizontal: 20 }}>
                <Image style={styles.avatar} source={{ uri: `${store.Picture}` }} />
                <View style={{ paddingLeft: 20, }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', paddingBottom: 5 }}>{store.StoreName}</Text>
                    <Text>{store.Email}</Text>
                </View>
            </View>
            <View style={styles.account}>
                <Text style={{ fontSize: 20, paddingLeft: 20, paddingVertical: 10 }}>Tài Khoản</Text>
                <View style={styles.item}>
                    <View style={styles.icon}>
                        <Icon
                            name='notifications-circle'
                            size={35}
                            color='#FF5DA2'
                        />
                        <Text style={styles.text} >Thông Báo</Text>
                    </View>
                    <Switch value={false} color="orange" />
                </View>
                <View style={styles.item}>
                    <View style={styles.icon}>
                        <Icon
                            name='lock-open'
                            size={35}
                            color='#3E7C17'
                        />
                        <Text style={styles.text} >Mật Khẩu</Text>
                    </View>
                    <Icon name='chevron-forward' size={30} color='gray' />
                </View>
                <View style={styles.item}>
                    <View style={styles.icon}>
                        <Icon
                            name='person-circle'
                            size={35}
                            color='#FFA400'
                        />
                        <Text style={styles.text} >Chỉnh Sửa Thông Tin</Text>
                    </View>
                    <Icon name='chevron-forward' size={30} color='gray' />
                </View>
                <View style={styles.item}>
                    <View style={styles.icon}>
                        <Icon
                            name='settings'
                            size={35}
                            color='#A9333A'
                        />
                        <Text style={styles.text} >Cài Đặt</Text>
                    </View>
                    <Icon name='chevron-forward' size={30} color='gray' />
                </View>
            </View>
            <View style={styles.account}>
                <Text style={{ fontSize: 20, paddingLeft: 20, paddingVertical: 10 }}>Thêm</Text>
                <View style={styles.item}>
                    <View style={styles.icon}>
                        <Icon
                            name='information-circle'
                            size={35}
                            color='#2F86A6'
                        />
                        <Text style={styles.text} >Tìm Hiểu Thêm</Text>
                    </View>
                    <Icon name='chevron-forward' size={30} color='gray' />
                </View>
                <View style={styles.item}>
                    <View style={styles.icon}>
                        <Icon
                            name='earth'
                            size={35}
                            color='#3E065F'
                        />
                        <Text style={styles.text} >Chính Sách</Text>
                    </View>
                    <Icon name='chevron-forward' size={30} color='gray' />
                </View>
            </View>
            <View style={styles.more}>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    avatar: {
        height: 100,
        width: 100,
        borderRadius: 100,
    },
    account: {

    },
    item: {
        backgroundColor: 'white',
        borderBottomColor: '#112D4E',
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 75,
        alignItems: 'center',
    },
    icon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        paddingLeft: 10,
        fontSize: 17,
        color: 'gray'
    }
});