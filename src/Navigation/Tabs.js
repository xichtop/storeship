import React from 'react';
import { StyleSheet, View, Button } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useDispatch } from 'react-redux'
import { logout } from '../slice/storeSlice'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Home from '../screens/Home'
import Money from '../screens/Money'
import Profile from '../screens/Profile'
import List from '../screens/List'
import Post from '../screens/Post'
import Login from '../components/Login'
import Register from '../components/Register'
import Bank from '../components/Bank'
import Identity from '../components/Identity'
import DeliveryDetail from '../components/DeliveryDetail'

const ListStack = createNativeStackNavigator();

const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
};

const ListScreen = () => {
    return (
        <ListStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#112D4E',
                },
                headerTintColor: '#F9F7F7',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },

                //animations 
                transitionSpec: {
                    open: config,
                    close: config,
                },
            }}>
            <ListStack.Screen name='ListIndex' component={List} options={{ title: 'Danh Sách Đơn Hàng' }} />
            <ListStack.Screen name='Detail' component={DeliveryDetail} options={{ title: 'Chi Tiết Đơn Hàng' }} />
        </ListStack.Navigator>
    )
}

const Tab = createBottomTabNavigator()

const Tabs = ({navigation}) => {

    const dispatch = useDispatch();

    const handleLogout = () => {
        const action = logout();
        dispatch(action);
        navigation.navigate('Login');
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                // headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 25,
                    left: 10,
                    right: 10,
                    elevation: 0,
                    backgroundColor: '#F9F7F7',
                    borderRadius: 15,
                    height: 90,
                    ...styles.shadow
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Index') {
                        iconName = focused ? 'home' : 'home-outline';
                        size = 30
                    }
                    else if (route.name === 'List') {
                        iconName = focused ? 'list-circle' : 'list-circle-outline';
                        size = 30
                    }
                    else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                        size = 30
                    }
                    else if (route.name === 'Money') {
                        iconName = focused ? 'wallet' : 'wallet-outline';
                        size = 30
                    }
                    else if (route.name === 'Post') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                        size = 33
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#112D4E',
                tabBarInactiveTintColor: '#112D4E',

                //headers 
                headerStyle: {
                    backgroundColor: '#112D4E',
                },
                headerTintColor: '#F9F7F7',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },

                //animations 
                transitionSpec: {
                    open: config,
                    close: config,
                },
            })}
        >
            <Tab.Screen name='Index' component={Home} options={{ tabBarLabel: 'Trang Chủ', title: 'Trang Chủ' }} />
            <Tab.Screen name='List' component={ListScreen} options={{ tabBarLabel: 'Đơn Hàng', headerShown: false }} />
            <Tab.Screen name='Post' component={Post} options={{ tabBarLabel: 'Tạo Đơn Hàng', title: 'Tạo Đơn Hàng' }} />
            <Tab.Screen name='Money' component={Money} options={{ tabBarLabel: 'Dòng Tiền', title: 'Dòng Tiền' }} />
            <Tab.Screen name='Profile' component={Profile} options={{
                tabBarLabel: 'Tài Khoản', title: 'Tài Khoản',
                headerRight: () => (
                    <Button
                        onPress={handleLogout}
                        title="Đăng xuất"
                        color="#F9F7F7"
                    />
                ),
                // headerLeft: () => (
                //     <Button
                //         onPress={() => alert('This is a button!')}
                //         title="Logout"
                //         color="#F9F7F7"
                //     />
                // ),
            }} />
        </Tab.Navigator>
    )
}

const AppStack = createNativeStackNavigator();

const Navigators = () => {
    return (
        <AppStack.Navigator>
            <AppStack.Screen name='Login' component={Login} options={{ headerShown: false }} />
            <AppStack.Screen name='Home' component={Tabs} options={{ headerShown: false }} />
            <AppStack.Screen name='Register' component={Register} options={{ headerShown: false }} />
            <AppStack.Screen name='Bank' component={Bank} options={{ headerShown: false }} />
            <AppStack.Screen name='Identity' component={Identity} options={{ headerShown: false }} />
        </AppStack.Navigator>
    )
}

// Di chuyển login lên trên để yêu cầu đâng nhập trước khi vào app

const styles = StyleSheet.create({
    shadow: {
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

export default Navigators