import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ReturnList from './ReturnList';
import List from './List'
import DeliveryDetail from '../components/DeliveryDetail'
import Step from '../components/Step'

const Tab = createMaterialTopTabNavigator();
const ListStack = createNativeStackNavigator();

const ReturnStack = createNativeStackNavigator();

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
            <ListStack.Screen name='ListIndex' component={List} options={{ headerShown: false }} />
            <ListStack.Screen name='Detail' component={DeliveryDetail} options={{ title: 'Chi Tiết Đơn Hàng' }} />
            <ListStack.Screen name='Step' component={Step} options={{ title: 'Trạng thái chi tiết' }} />
        </ListStack.Navigator>
    )
}

const ReturnScreen = () => {
    return (
        <ReturnStack.Navigator
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
            <ReturnStack.Screen name='ListIndex' component={ReturnList} options={{ headerShown: false }} />
            <ReturnStack.Screen name='Detail' component={DeliveryDetail} options={{ title: 'Chi Tiết Đơn Hàng' }} />
            <ListStack.Screen name='Step' component={Step} options={{ title: 'Trạng thái chi tiết' }} />
        </ReturnStack.Navigator>
    )
}

export default function OrderScreen() {

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 12, color: '#112D4E' },
                tabBarStyle: { backgroundColor: '#F9F7F7' },
            }}
        >
            <Tab.Screen name="Order" component={ListScreen} options={{ title: 'Danh Sách Đơn Giao' }} />
            <Tab.Screen name="Return" component={ReturnScreen} options={{ title: 'Danh Sách Đơn Trả' }} />
        </Tab.Navigator>
    )
}