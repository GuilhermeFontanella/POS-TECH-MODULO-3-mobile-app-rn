import Navbar from "@/components/navbar/Navbar";
import { StyleSheet, View } from "react-native";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Asterisk, Eye, EyeClosed } from "lucide-react-native";
import { useState } from "react";
import { Image } from 'react-native';
import Ilustracao from '@/assets/images/Ilustracao1.png'


export default function MainPage() {
    const date = new Date(Date.now());

    const formattedDate = date.toLocaleDateString("pt-BR", {
        weekday: "long",   // dia da semana por extenso
        year: "numeric",
        month: "long",     // mês por extenso
        day: "numeric",
    });

    const style = StyleSheet.create({
        separator: {
            width: '90%',
            height: 2,
            color: 'lightGray',
            margin: 'auto'
        },
        ammount: {
            flexDirection: 'row'
        },
        card: {
            backgroundColor: '#004D61',
            height: 600,
            marginTop: 24,
            marginLeft: 8,
            marginRight: 8
        }
    });

    const [isAmmountHidden, setIsAmmountHidden] = useState(false);
    

    return (
        <>
           <View>
                <Navbar />
            </View>
            <Card style={style.card}>
                <CardHeader>
                    <CardTitle variant={'h1'}>Olá, Joana! :)</CardTitle>
                    <CardDescription variant={'h1'}>{formattedDate}</CardDescription>
                </CardHeader>
                <CardContent>
                    <View>
                        <Text variant={'h1'}>Saldo</Text>
                        <Button variant={'ghost'} onPress={() => setIsAmmountHidden(!isAmmountHidden)}>
                            {!isAmmountHidden ? <Eye color={'#FF5031'} /> : <EyeClosed color={'#FF5031'} />}
                        </Button>
                        
                    </View>
                    <Separator />
                    <View >
                        <Text>Conta corrente</Text>
                        {
                        !isAmmountHidden 
                            ? <Text variant={'h1'}>R$ 2.000,00</Text>
                            : <View style={style.ammount}>
                                <Text variant={'h1'}>R$ </Text>
                                <Asterisk color={'#FF5031'} />
                                <Asterisk color={'#FF5031'} />
                                <Asterisk color={'#FF5031'} />
                                <Asterisk color={'#FF5031'} />
                                <Asterisk color={'#FF5031'} />
                            </View>
                        }
                    </View>
                </CardContent>
                <CardFooter>
                    <View style={{justifyContent: 'center', alignContent: 'flex-end', width: '100%', backgroundColor: 'red', height: '100%', bottom: 0}}>
                        <Image
                            source={Ilustracao}
                            alt="Photo by Drew Beamer (https://unsplash.com/@dbeamer_jpg)"
                            className="absolute bottom-0 left-0 right-0 top-0 object-cover"
                        />
                    </View>
                </CardFooter>
            </Card>
        </>

    )
}