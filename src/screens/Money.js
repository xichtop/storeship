import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FeeMoney from '../components/FeeMoney';
import CODMoney from '../components/CODMoney'

const Tab = createMaterialTopTabNavigator();

export default function List() {

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 12, color: '#112D4E' },
                tabBarStyle: { backgroundColor: '#F9F7F7' },
            }}
        >
            <Tab.Screen name="COD" component={CODMoney} options={{title: 'Tiền Thu Hộ'}}/>
            <Tab.Screen name="Fee" component={FeeMoney} options={{title: 'Phí Giao Hàng'}} />
        </Tab.Navigator>
    )
}