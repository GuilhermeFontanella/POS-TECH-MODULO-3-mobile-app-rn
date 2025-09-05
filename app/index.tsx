import { Link } from "expo-router";
import { Text, View } from "react-native";
import '../global.css';

function Index() {
    return (
        <View>
            <Text style={{color: 'white'}}>Teste</Text>
            <Link href={{pathname: '/pinguelo'}} style={{color: 'white'}}>Pinguelo</Link>
        </View>
    )
}

export default Index;