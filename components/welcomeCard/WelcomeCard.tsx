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
import PixelBottom from '@/assets/images/Pixels2.png';
import PixelTop from '@/assets/images/Pixels1.png'

export default function WelcomeCard() {
    const date = new Date(Date.now());

    const formattedDate = date.toLocaleDateString("pt-BR", {
        weekday: "long", 
        year: "numeric",
        month: "long",     
        day: "numeric",
    });

    const style = StyleSheet.create({
        row: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            paddingBottom: 16
        },
        separator: {
            backgroundColor: '#FFFFFF',
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
        },
        navbar: {
            zIndex: 1
        },
        mainContent: {
            width: '55%',
            margin: 'auto',

        },
        ammountDisplay: {
            marginTop: 16
        }
    });

    const [isAmmountHidden, setIsAmmountHidden] = useState(false);

    return (
        <Card style={style.card}>
            <CardHeader>
                <CardTitle variant={'h1'}>Olá, Joana! :)</CardTitle>
                <CardDescription variant={'h1'}>{formattedDate}</CardDescription>
            </CardHeader>
            <CardContent>
                <View style={{ justifyContent: 'center', alignContent: 'flex-end', width: '100%', height: '100%', position: 'absolute', top: -100, left: 0 }}>
                    <Image
                        source={PixelTop}
                        alt="Photo by Drew Beamer (https://unsplash.com/@dbeamer_jpg)"
                        className="absolute bottom-0 left-0 right-0 top-0 object-cover"
                    />
                </View>
                <View style={[style.row, style.mainContent]}>
                    <Text variant={'h1'}>Saldo</Text>
                    <Button style={{ marginLeft: 8 }} variant={'ghost'} onPress={() => setIsAmmountHidden(!isAmmountHidden)}>
                        {!isAmmountHidden ? <Eye color={'#FF5031'} size={30} /> : <EyeClosed color={'#FF5031'} size={30} />}
                    </Button>

                </View>
                <Separator style={style.separator} />
                <View style={[style.mainContent, style.ammountDisplay]}>
                    <Text style={{ marginLeft: 10, marginBottom: 8 }}>Conta corrente</Text>
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
                <View style={{ justifyContent: 'center', alignContent: 'flex-end', width: '100%', height: '100%', position: 'absolute', bottom: -80, left: 20 }}>
                    <Image
                        source={Ilustracao}
                        alt="Photo by Drew Beamer (https://unsplash.com/@dbeamer_jpg)"
                        className="absolute bottom-0 left-0 right-0 top-0 object-cover"
                    />
                </View>
                <View style={{ justifyContent: 'center', alignContent: 'flex-end', width: '100%', height: '100%', position: 'absolute', bottom: -211, left: 270 }}>
                    <Image
                        source={PixelBottom}
                        alt="Photo by Drew Beamer (https://unsplash.com/@dbeamer_jpg)"
                        className="absolute bottom-0 left-0 right-0 top-0 object-cover"
                    />
                </View>
            </CardFooter>
        </Card>
    )
}