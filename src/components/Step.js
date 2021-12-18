import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import coordinationAPI from '../api/coordinationAPI'
import { useSelector } from 'react-redux'


export default function Step({ route }) {

    const { DeliveryId } = route.params;

    const token = useSelector(state => state.store.token);

    const [coor, setCoor] = useState([]);

    const fetchCoor = async () => {
        try {
            const coor = await coordinationAPI.getById(DeliveryId, token);
            coor.reverse();
            setCoor(coor);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchCoor();
    }, [DeliveryId]);

    return (
        <View style={{ paddingTop: 10, paddingLeft: 20 }}>
            <ScrollView style={{ height: 570 }}>
                <View style={{ ...styles.step, height: 670 }}></View>
                {coor.map((item, index) => (
                    <View style={styles.box} key={index}>
                        {index === 0 ?
                            <View style={styles.circleMain}></View>
                            :
                            <View style={styles.circle}></View>
                        }
                        <View>
                            {index === 0 ?
                                <Text style={{ ...styles.status, color: '#3F72AF' }}>{item}</Text>
                                :
                                <Text style={{ ...styles.status, color: 'gray' }}>{item}</Text>
                            }
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View >

    )
}

const styles = StyleSheet.create({
    box: {
        paddingLeft: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingVertical: 5
    },
    step: {
        position: 'absolute',
        top: 20,
        left: 20,
        borderLeftWidth: 2,
        borderLeftColor: 'gray'
    },
    circleMain: {
        backgroundColor: '#3F72AF',
        borderRadius: 6,
        height: 12,
        width: 12,
        marginRight: 10,
        marginTop: 5
    },
    circle: {
        backgroundColor: 'gray',
        borderRadius: 4,
        height: 8,
        width: 8,
        marginRight: 10,
        marginLeft: 2,
        marginTop: 7
    },
    status: {
        fontSize: 16
    },
});
