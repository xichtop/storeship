import React from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-elements'
import { useSelector } from 'react-redux'

export default function Bank ({navigation}) {

    const store = useSelector(state => state.register.store);

    const handleConsole = () => {
        console.log(store);
    }
    
    return (
        <View>
            <Text style={{paddingTop: 100}}>Bank Screen</Text>
            <Button title = "console"
                onPress = {handleConsole} />
            
            <Button title = "next"
                onPress = {() => navigation.navigate('Identity')} />
        </View>
    )
}