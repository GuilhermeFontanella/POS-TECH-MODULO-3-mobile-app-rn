import { Link } from "expo-router";
import * as React from 'react';
import { Text, View } from "react-native";
import '../global.css';

function Index() {
    return (
        <View>
            <Text style={{color: 'white'}}>Teste 01</Text>
            <Link href={{pathname: '/'}} style={{color: 'white'}}>Teste 02</Link>
        </View>
    )
}

export default Index;