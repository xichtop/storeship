import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SafeAreaView } from 'react-native-safe-area-context'

import Login from './src/components/Login'
import Register from './src/components/Register'
import Home from './src/pages/Home'
import Task from './src/pages/Task'
import Profile from './src/pages/Profile'


const AuthStack = createNativeStackNavigator()
const AppStack = createNativeStackNavigator()
const AppTab = createBottomTabNavigator()
const AuthScreen = () => {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name="login" component={Login} />
            <AuthStack.Screen name="register" component={Register} options={{ headerShown: false }} />
        </AuthStack.Navigator>
    )
}

const AppTabScrenn = () => {
    return (
        <AppTab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home';
                    } else if (route.name === 'Task') {
                        iconName = focused ? 'list' : 'list';
                    }
                    else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person';
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'green',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <AppTab.Screen name="Home" component={Home} options={{ title: "TRANG CHỦ" }} />
            <AppTab.Screen name="Task" component={Task} options={{ title: "DANH SÁCH" }} />
            <AppTab.Screen name="Profile" component={Profile} options={{ tabBarBadge: 3, title: "CÁ NHÂN" }} />
        </AppTab.Navigator>
    )
}

function AppNavigator() {
    return (
        <SafeAreaView style={{flex: 1}}>
            <NavigationContainer>
                <AppStack.Navigator>
                    <AppStack.Screen name="auth" component={AuthScreen} />
                    <AppStack.Screen name="app" component={AppTabScrenn} /> 
                </AppStack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
}

export default AppNavigator
