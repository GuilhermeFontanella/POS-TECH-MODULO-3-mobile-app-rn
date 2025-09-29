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
import React, { useState } from "react";
import { Icon } from '@/components/ui/icon';
import { Pencil, Trash2, CircleX } from "lucide-react-native";
import { Separator } from "@/components/ui/separator";
import { TRANSACTION_TYPE } from "@/constants/transactionType";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "../ui/label";
import { IUser } from "@/app/models/user.interface";
import UserService from "@/app/user.service";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { transactionOptions } from '../../constants/transactionsOptions';
import CurrencyInput from "react-native-currency-input";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Spinner from "../ui/spinner";

interface TransactionsProps {
    transactions: any[];
    user: IUser;
    onRegister: () => void;
}

function TransactionModal({
    modalType, 
    elementSelected,
    onClose
}: {
    modalType: 'edit' | 'exclude',
    elementSelected: any;
    onClose: () => void;
}) {
    const [newValue, setNewValue] = useState(elementSelected.type);
    const [transactionValue, setTransactionValue] = useState<number>(elementSelected.ammount);
    const service: UserService = new UserService();
    const [showAlert, setShowAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const editExclude = (isExlude: boolean, data: any) => {
        setIsLoading(true);
        try {
            const response = service.editTransaction({...data, deleted: isExlude});
            setIsModalOpen(false);
            onClose();
            return response;
        } catch (err: any) {
            setShowAlert(true);
            throw new Error(err);
        } finally {
            setIsLoading(false);
        }
    }
        
  return (
    <Dialog open={isModalOpen}>
      <DialogTrigger asChild>
        {modalType === 'edit' ? (
            <Button size={'lg'} style={style.button} onPress={() => setIsModalOpen(!isModalOpen)}>
                <Icon as={modalType === 'edit' ? Pencil : Trash2} size={20} />
            </Button>
        ) : (
            <Button size={'lg'} style={style.button} onPress={() => setIsModalOpen(!isModalOpen)}>
                <Icon as={Trash2} size={20} color={'red'} />
            </Button>
        )}
      </DialogTrigger>

      <DialogContent portalHost="root">
        <DialogHeader style={{marginTop: 16}}>
          <DialogTitle>
            {modalType === 'edit'
              ? <Text className="text-2xl">Editar transação</Text>
              : <Text className="text-2xl">Tem certeza que deseja excluir esta transação?</Text>}
          </DialogTitle>
          <DialogDescription>
            <Text className="text-1xl">As alterações não poderão ser desfeitas.</Text>
          </DialogDescription>
        </DialogHeader>
        <View>
            <RadioGroup value={newValue} onValueChange={(value) => setNewValue(value)}>
                <Label htmlFor="r1">
                    <Text className="text-xl ">Tipo de transação</Text>
                </Label>
                {transactionOptions.map((e => (
                    <View className="flex flex-row items-center gap-3">
                        <RadioGroupItem style={{height: 25, width: 25}} value={e.value} id={e.value} />
                        <Label htmlFor="r1">
                            <Text className="text-xl ">{e.label}</Text>
                        </Label>
                    </View>

                )))}
            </RadioGroup>
            <View style={style.ammountInput}>
                <View style={{marginBottom: 16}}>
                    <Text className="text-2xl">Valor</Text>
                </View>
                <View style={style.fakeInput}>
                    <CurrencyInput className="text-3xl" style={style.currencyInput} value={transactionValue} onChangeValue={(value: number) => setTransactionValue(value)} />
                </View>
            </View>
        </View>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onPress={() => setIsModalOpen(!isModalOpen)}>
              <Text>Cancelar</Text>
            </Button>
          </DialogClose>
          <Button 
            variant={modalType === 'edit' ? 'default' : 'destructive'} 
            onPress={() => {
                editExclude(
                    modalType === 'edit' 
                        ? false 
                        : true, {
                            ...elementSelected,
                            type: newValue,
                            ammount: transactionValue
                        }
                ).then(() => setIsModalOpen(false))
            }}>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <Text>{modalType === 'edit' ? 'Salvar' : 'Excluir'}</Text>
                )}
          </Button>
          {showAlert && (
            <Alert icon={CircleX}>
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    You can use a terminal to run commands on your computer.
                </AlertDescription>
            </Alert>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function Transactions({ transactions, onRegister }: TransactionsProps) {
    const formatDate = (value: string): string => {
        const date = new Date(value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatMonth = (value: string): string => {
        const fullMonth = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date(value));
        return fullMonth.charAt(0).toUpperCase() + fullMonth.slice(1);
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
                </CardHeader>
                <CardContent>
                    <ScrollView>
                        {transactions && transactions.filter((element: any) => element.deleted === false).map((element: any, index: number) => (
                            <View key={index} style={style.transactionContent}>
                                <View>
                                    <Text className="text-green-600 text-2xl">{formatMonth(element.createdAt)}</Text>
                                </View>
                                <View style={style.transactionInfo}>
                                    <Text className="text-black text-3xl" style={style.textHeaderTransactionInfo}>
                                        {TRANSACTION_TYPE[element?.type] ?? element?.type}
                                    </Text>
                                    <View>
                                        <Text className="text-gray-300 text-2xl">{formatDate(element.createdAt)}</Text>
                                        <View style={style.buttonContainer}>
                                            <TransactionModal modalType='edit' elementSelected={element} onClose={() => onRegister()} />
                                            <TransactionModal modalType='exclude' elementSelected={element} onClose={() => onRegister()} />
                                        </View>
                                    </View>
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