import { ScrollView, View } from "react-native";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Button } from "@/components/ui/button";
import { Styles as style } from './Transactions.css';
import React, { useEffect } from "react";
import { Icon } from '@/components/ui/icon';
import { Pencil, Trash2 } from "lucide-react-native";
import { Separator } from "@/components/ui/separator";
import { TRANSACTION_TYPE } from "@/constants/transactionType";

interface TransactionsProps {
    transactions: any[];
}

export default function Transactions({transactions}: TransactionsProps) {

    const formatDate = (value: string): string => {
        const date = new Date(value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatMonth = (value: string): string => {
        const fullMonth = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date(value));
        return fullMonth.charAt(0).toUpperCase() + fullMonth.slice(1) ;
    };

    return (
        <>
        <Card style={style.card}>
            <CardHeader style={style.cardHeader}>
                <View style={style.headerContainer}>
                    <CardTitle variant={'h1'} className="text-black">
                        Extrato
                    </CardTitle>
                </View>
                <View style={style.buttonContainer}>
                    <Button size={'lg'} style={style.button}>
                        <Icon as={Pencil} size={20} />
                    </Button> 
                    <Button size={'lg'} style={style.button}>
                        <Icon as={Trash2} size={20} color={'red'} />
                    </Button>
                </View>
            </CardHeader>
            <CardContent>
                <ScrollView>
                {transactions && transactions.map((element: any) => (
                    <View style={style.transactionContent}>
                        <View>
                            <Text className="text-green-600 text-2xl">{formatMonth(element.createdAt)}</Text>
                        </View>
                        <View style={style.transactionInfo}>
                            <Text className="text-black text-3xl" style={style.textHeaderTransactionInfo}>
                                {TRANSACTION_TYPE[element?.type] ?? element?.type}
                            </Text>
                            <Text className="text-gray-300 text-2xl">{formatDate(element.createdAt)}</Text>
                        </View>
                        <View>
                            <Text className="text-black" style={style.textAmmountTransactionInfo}> R$ {element?.ammount.toFixed(2)}</Text>
                        </View>
                        <Separator className="my-4" />
                    </View>
                ))}
                </ScrollView>
            </CardContent>
        </Card>
        </>
    )
}