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
import React from "react";
import { IUser } from "@/app/models/user.interface";
import UserService from "@/app/user.service";
import { Option } from "@rn-primitives/select";
import Spinner from "../ui/spinner";
import { transactionOptions } from "@/constants/transactionsOptions";

interface NewTransactionCardProps {
    user: IUser,
    onRegister: () => void;
}

export default function NewTransactionCard({user, onRegister}: NewTransactionCardProps) {
    const service: UserService = new UserService();
    const insets = useSafeAreaInsets();
    const [transactionValue, setTransactionValue] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [type, setType] = useState<Option | undefined>(undefined);

    const contentInsets = {
        top: insets.top,
        bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 60 }),
        left: 12,
        right: 12,
    };

    const registerNewTransaction = async () => {
        setIsLoading(true);
        const payload = {
            createdAt: new Date().getUTCDate(),
            userId: user.id,
            ammount: transactionValue,
            type: type?.value 
        };
        try {
            const response = await service.registerNewTransaction(payload);
            onRegister();
        } catch (error: any) {
            throw Error(error);
        } finally {
            setIsLoading(false);
            setTransactionValue(null);
            setType(undefined);
        }
    }

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
                    <Select 
                        className="text-black" 
                        onValueChange={setType} 
                        value={type ?? undefined}
                        >
                        <SelectTrigger style={style.select} className="w-[180px]">
                            <SelectValue 
                            className="text-black text-1xl" 
                            placeholder="Selecione a transação" 
                            />
                        </SelectTrigger>

                        <SelectContent portalHost="root" style={style.selectOptions} insets={contentInsets} className="w-[180px]">
                            <NativeSelectScrollView>
                            <SelectGroup>
                                <SelectLabel className="text-1xl text-white">
                                Escolha o tipo de transferência
                                </SelectLabel>
                                {transactionOptions.map((option) => (
                                <SelectItem 
                                    className="text-black" 
                                    key={option.value} 
                                    label={option.label} 
                                    value={option.value}   // 👈 importante
                                >
                                    {option.label}
                                </SelectItem>
                                ))}
                            </SelectGroup>
                            </NativeSelectScrollView>
                        </SelectContent>
                    </Select>

                </View>
                <View style={style.mainContent}>
                    <View style={style.ammountInput}>
                        <View style={{marginBottom: 16}}>
                            <Text className="text-2xl">Valor</Text>
                        </View>
                        <View style={style.fakeInput}>
                            <CurrencyInput className="text-3xl" style={style.currencyInput} value={transactionValue} onChangeValue={setTransactionValue} />
                        </View>
                    </View>
                </View>
                <View>
                    <Button disabled={transactionValue === null || type === null} size={'lg'} style={style.button} onPress={registerNewTransaction}>
                        {isLoading ? (
                            <Spinner />
                        ) : (<Text className="text-2xl text-center" style={{color: 'white'}}>Concluir transação</Text>)}
                       
                    </Button>
                </View>
                
            </CardContent>
            <CardFooter>
                <View style={{ justifyContent: 'center', alignContent: 'flex-end', width: '100%', height: '100%', position: 'absolute', bottom: 50, left: 20 }}>
                    <Image
                        source={Ilustracao2}
                        alt="Photo by Drew Beamer (https://unsplash.com/@dbeamer_jpg)"
                        className="absolute bottom-0 left-0 right-0 top-0 object-cover"
                    />
                </View>
                <View style={{ justifyContent: 'center', alignContent: 'flex-end', width: '100%', height: '100%', position: 'absolute', bottom: -65, left: 270 }}>
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