import { View } from "react-native";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Image } from 'react-native';
import Ilustracao2 from '@/assets/images/Ilustracao2.png'
import PixelBottom from '@/assets/images/Pixels2.png';
import PixelTop from '@/assets/images/Pixels1.png'
import {
    NativeSelectScrollView,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { Styles as style } from './NewTransactionCard.css';

const transactionOptions = [
  { label: 'Transferência', value: 'transfer' },
  { label: 'Depósito', value: 'deposit' },
  { label: 'Pagar boleto', value: 'pay-bill' },
  
];

export default function NewTransactionCard() {
    const insets = useSafeAreaInsets();
    const [transactionValue, setTransactionValue] = useState<number | null>(null);

    const contentInsets = {
        top: insets.top,
        bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 60 }),
        left: 12,
        right: 12,
    };

    return (
        <>
        <Card style={style.card}>
            <CardHeader>
                <CardTitle variant={'h1'}>Nova transação</CardTitle>
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
                    <Select>
                    <SelectTrigger style={style.select} className="w-[180px]">
                        <SelectValue placeholder="Selecione a transação" />
                    </SelectTrigger>
                    <SelectContent style={style.selectOptions} insets={contentInsets} className="w-[180px]">
                        <NativeSelectScrollView>
                        <SelectGroup>
                            <SelectLabel>Escolha o tipo de transferência</SelectLabel>
                            {transactionOptions.map((option) => (
                            <SelectItem key={Math.random()} label={option.label} value={option.value}>
                                {option.label}
                            </SelectItem>
                            ))}
                        </SelectGroup>
                        </NativeSelectScrollView>
                    </SelectContent>
                    </Select>

                </View>
                <View style={style.mainContent}>
                    <View style={style.fakeInput}>
                        {transactionValue !== null && transactionValue > 0 
                        ? (
                            <>
                                <Text style={{color: '#000', marginRight: 8}}>R$</Text>
                                <CurrencyInput style={style.currencyInput} value={transactionValue} onChangeValue={setTransactionValue} />
                            </>
                        )
                        :  (
                            <>
                                <Text style={{color: 'gray', width: '13%'}}>Valor</Text>
                                <CurrencyInput style={{width: '80%'}} value={transactionValue} onChangeValue={setTransactionValue} />
                            </>
                        )  

                        }   
                    </View>
                </View>
                <View>
                    <Button size={'lg'} style={style.button}>
                        <Text style={{color: 'white'}}>Concluir transação</Text>
                    </Button>
                </View>
                
            </CardContent>
            <CardFooter>
                <View style={{ justifyContent: 'center', alignContent: 'flex-end', width: '100%', height: '100%', position: 'absolute', bottom: -80, left: 20 }}>
                    <Image
                        source={Ilustracao2}
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
        </>
    )
}