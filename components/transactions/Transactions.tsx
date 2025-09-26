
// import { Button } from "@/components/ui/button";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from '@/components/ui/card';
// import { Icon } from '@/components/ui/icon';
// import { Separator } from "@/components/ui/separator";
// import { Text } from '@/components/ui/text';
// import { TRANSACTION_TYPE } from "@/constants/transactionType";
// import { Pencil, Trash2 } from "lucide-react-native";
// import React from "react";
// import { ScrollView, View } from "react-native";
// import { Styles as style } from './Transactions.css';

// interface TransactionsProps {
//     transactions: any[];
// }

// export default function Transactions({transactions}: TransactionsProps) {

//     const formatDate = (value: string): string => {
//         const date = new Date(value);
//         const day = String(date.getDate()).padStart(2, "0");
//         const month = String(date.getMonth() + 1).padStart(2, "0");
//         const year = date.getFullYear();
//         return `${day}/${month}/${year}`;
//     };

//     const formatMonth = (value: string): string => {
//         const fullMonth = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date(value));
//         return fullMonth.charAt(0).toUpperCase() + fullMonth.slice(1) ;
//     };

//     return (
//         <>
//         <Card style={style.card}>
//             <CardHeader style={style.cardHeader}>
//                 <View style={style.headerContainer}>
//                     <CardTitle variant={'h1'} className="text-black">
//                         Extrato
//                     </CardTitle>
//                 </View>
//                 <View style={style.buttonContainer}>
//                     <Button size={'lg'} style={style.button}>
//                         <Icon as={Pencil} size={20} />
//                     </Button> 
//                     <Button size={'lg'} style={style.button}>
//                         <Icon as={Trash2} size={20} color={'red'} />
//                     </Button>
//                 </View>
//             </CardHeader>
//             <CardContent>
//                 <ScrollView>
//                 {transactions && transactions.map((element: any) => (
//                     <View style={style.transactionContent}>
//                         <View>
//                             <Text className="text-green-600 text-2xl">{formatMonth(element.createdAt)}</Text>
//                         </View>
//                         <View style={style.transactionInfo}>
//                             <Text className="text-black text-3xl" style={style.textHeaderTransactionInfo}>
//                                 {TRANSACTION_TYPE[element?.type] ?? element?.type}
//                             </Text>
//                             <Text className="text-gray-300 text-2xl">{formatDate(element.createdAt)}</Text>
//                         </View>
//                         <View>
//                             <Text className="text-black" style={style.textAmmountTransactionInfo}> R$ {element?.ammount.toFixed(2)}</Text>
//                         </View>
//                         <Separator className="my-4" />
//                     </View>
//                 ))}
//                 </ScrollView>
//             </CardContent>
//         </Card>
//         </>
//     )
// }



import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    FlatList, Modal, StyleSheet,
    Platform,
    ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

type Transaction = {
    id: string;
    month: string;
    categoria: {
        id: string;
        description: string;
        amount: number;
        type: 'income' | 'expense' | 'transfer';
        date: string;
    }[];
};

const formatCurrencyBRL = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatDateBR = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR');

interface TransactionsProps {
    transactions: any[];
}

export default function Transactions() {

    // Filtros
    const [filters, setFilters] = useState<{ date?: Date; type?: string }>({});
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Lista mockada
    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            id: '1',
            month: 'Setembro',
            categoria: [
                { id: 'a1', description: 'Depósito salário', amount: 3500, type: 'income', date: '2025-09-01' },
                { id: 'a2', description: 'Transferência amigo', amount: -200, type: 'transfer', date: '2025-09-10' },
                { id: 'a3', description: 'Depósito salário', amount: 3500, type: 'income', date: '2025-09-01' },
                { id: 'a4', description: 'Transferência amigo', amount: -200, type: 'transfer', date: '2025-09-10' },
                { id: 'a5', description: 'Depósito salário', amount: 3500, type: 'income', date: '2025-09-01' },
                { id: 'a6', description: 'Transferência amigo', amount: -200, type: 'transfer', date: '2025-09-10' },
                { id: 'a7', description: 'Depósito salário', amount: 3500, type: 'income', date: '2025-09-01' },
                { id: 'a8', description: 'Transferência amigo', amount: -200, type: 'transfer', date: '2025-09-10' },
            ]
        }
    ]);

    const [filtered, setFiltered] = useState<Transaction[]>([]);
    const [mensagemErro, setMensagemErro] = useState('');

    // Modal edição
    const [showEditModal, setShowEditModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [editFields, setEditFields] = useState({ description: '', type: 'income', amount: '', date: '', month: '' });

    useEffect(() => {
        applyFilters();
    }, [filters, transactions]);

    const applyFilters = () => {
        let result = [...transactions];
        if (filters.type) {
            result = result.map(t => ({
                ...t,
                categoria: t.categoria.filter(c => c.type === filters.type)
            })).filter(t => t.categoria.length);
        }
        if (filters.date) {
            const d = filters.date.toISOString().split('T')[0];
            result = result.map(t => ({
                ...t,
                categoria: t.categoria.filter(c => c.date.startsWith(d))
            })).filter(t => t.categoria.length);
        }
        setFiltered(result);
        if (result.length === 0) setMensagemErro('Nenhuma transação encontrada com os filtros aplicados.');
        else setMensagemErro('');
    };

    const clearFilters = () => {
        setFilters({});
        setMensagemErro('');
    };

    const openEditModal = (transactionId: string, item: any, month: string) => {
        setEditItem({ transactionId, itemId: item.id });
        setEditFields({
            description: item.description,
            type: item.type,
            amount: item.amount.toString(),
            date: item.date,
            month
        });
        setShowEditModal(true);
    };

    const saveEdit = () => {
        if (!editFields.description || !editFields.amount) return;
        setTransactions(prev => prev.map(t => {
            if (t.id !== editItem.transactionId) return t;
            return {
                ...t,
                categoria: t.categoria.map(c =>
                    c.id === editItem.itemId ? {
                        ...c,
                        description: editFields.description,
                        amount: parseFloat(editFields.amount),
                        type: editFields.type as any,
                        date: editFields.date
                    } : c
                )
            };
        }));
        setShowEditModal(false);
    };

    const deleteCategoria = (transactionId: string, itemId: string) => {
        setTransactions(prev => prev.map(t => {
            if (t.id !== transactionId) return t;
            return {
                ...t,
                categoria: t.categoria.filter(c => c.id !== itemId)
            };
        }).filter(t => t.categoria.length));
    };

    return (
        <View style={styles.container}>
            {/* Filtros */}
            <View style={styles.filtersRow}>
                <TouchableOpacity
                    style={styles.filterGroup}
                    onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.selectData}>{filters.date ? filters.date.toLocaleDateString('pt-BR') : 'Selecionar Data'}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={filters.date || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            if (Platform.OS === 'android') {
                                setShowDatePicker(false);
                            }
                            if (event.type === 'set' && selectedDate) {
                                setFilters({ ...filters, date: selectedDate });
                            }
                        }}
                    />
                )}
                <View style={styles.filtersRow}>
                    {/* SELECT para o tipo */}
                    <Picker
                        selectedValue={filters.type || ''}
                        style={styles.inputType}
                        onValueChange={(itemValue) =>
                            setFilters({ ...filters, type: itemValue })
                        }>
                        <Picker.Item label="Selecione o tipo" value="" />
                        <Picker.Item label="Depósito" value="income" />
                        <Picker.Item label="Transferência" value="transfer" />
                        <Picker.Item label="Todos" value="" />
                    </Picker>
                    <TouchableOpacity style={styles.btnCircle} onPress={clearFilters}>
                        <Text>❌</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.filtersRowExtrato}>
                <Text style={styles.headerTitle}>Extrato</Text>
                {mensagemErro ? <Text style={styles.alert}>{mensagemErro}</Text> : null}
            </View>

            <View style={styles.filtersRowExtrato}>
                <View style={{ flex: 1, maxHeight: 400 }}>
                    <FlatList
                        data={filtered}
                        style={{ flex: 1 }}
                        keyExtractor={t => t.id}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        // contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                        renderItem={({ item }) => (
                            <View>
                                <Text style={styles.month}>{item.month}</Text>
                                {item.categoria.map(cat => (
                                    <View key={cat.id} style={styles.itemRow}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.description}>{cat.description}</Text>
                                            <Text style={styles.amount}>{formatCurrencyBRL(cat.amount)}</Text>
                                            <Text style={styles.date}>{formatDateBR(cat.date)}</Text>
                                        </View>
                                        <View style={styles.actions}>
                                            <TouchableOpacity onPress={() => openEditModal(item.id, cat, item.month)}>
                                                <Text style={styles.edit}>✏️</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => deleteCategoria(item.id, cat.id)}>
                                                <Text style={styles.delete}>🗑️</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                        ListEmptyComponent={<Text style={styles.noResults}>Nenhuma transação encontrada.</Text>}
                    />
                </View>
            </View>


            {/* Modal Edição */}
            <Modal visible={showEditModal} transparent animationType="slide">
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Transação</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Descrição"
                            value={editFields.description}
                            onChangeText={t => setEditFields({ ...editFields, description: t })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Valor"
                            keyboardType="numeric"
                            value={editFields.amount}
                            onChangeText={t => setEditFields({ ...editFields, amount: t })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Data (YYYY-MM-DD)"
                            value={editFields.date}
                            onChangeText={t => setEditFields({ ...editFields, date: t })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Mês"
                            value={editFields.month}
                            onChangeText={t => setEditFields({ ...editFields, month: t })}
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.btnPrimary} onPress={saveEdit}>
                                <Text style={{ color: '#fff' }}>Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSecondary} onPress={() => setShowEditModal(false)}>
                                <Text>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container1: {
        padding: 20,
        minHeight: 302,
        display: "flex",
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        margin: 16,
    },
    filtersRowExtrato: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        display: "flex",
        alignItems: 'flex-end',
        rowGap: 15,
        width: '90%',
        marginLeft: 16
    },
    inputDate: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginRight: 8 },
    inputType: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginRight: 5 },
    btnCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0', marginRight: 0 },
    header1: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    alert: { color: 'red', margin: 20 },
    month: { fontSize: 14, fontWeight: '600', marginTop: 12, color: '#47A138', },
    selectData: { fontSize: 16, fontWeight: '600', marginTop: 16 },
    itemRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#47A138' },
    description1: { fontSize: 16, fontWeight: '500' },
    amount: { fontSize: 16, color: '#000000', fontWeight: '600', },
    date1: { fontSize: 12, color: '#666' },
    actions: { flexDirection: 'row', alignItems: 'center' },
    edit: { fontSize: 20, marginHorizontal: 4 },
    delete: { fontSize: 20, marginHorizontal: 4 },
    noResults1: { textAlign: 'center', marginTop: 20, color: '#555' },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    modalContent1: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 10 },
    modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 10 },
    modalActions1: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    btnPrimary: { backgroundColor: '#004D61', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
    btnSecondary: { paddingVertical: 8, paddingHorizontal: 16 },

    container: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 16,
        marginTop: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        minWidth: 282,
        width: '96%',
        minHeight: 480, // equivalente a calc(100vh - 96px)
        paddingRight: 10
    },

    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 32,
        minWidth: 320,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 32,
        elevation: 5,
        flexDirection: 'column'
    },

    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        columnGap: 16 // RN >=0.71; ou use marginRight nos filhos
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },

    description: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2
    },

    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#004D61',
        justifyContent: 'center',
        alignItems: 'center'
    },

    margem: { marginLeft: 8 },

    alineButton: {
        minWidth: 110,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 24
    },

    title: { minWidth: 112 },

    line: {
        borderBottomWidth: 1,
        borderBottomColor: '#47A138',
        marginBottom: 15
    },

    transactionDate: {
        color: '#47A138',
        fontWeight: '600',
        marginBottom: 8
    },

    date: {
        justifyContent: 'center',
        alignItems: 'center',
        color: '#8B8B8B',
        fontSize: 13,
        fontWeight: '400',
        marginLeft: 24
    },

    text: {
        color: '#000',
        fontSize: 16,
        fontWeight: '400'
    },

    value: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16
    },

    customModalBg: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },

    noResults: {
        padding: 32,
        textAlign: 'center',
        color: '#777',
        fontStyle: 'italic'
    },

    filtersContainer: {
        flexDirection: 'column',
        backgroundColor: '#f6f9f9',
        padding: 5,
        borderRadius: 8,
        marginBottom: 16,
        width: '100%'
    },

    filtersRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        rowGap: 1,
        width: '90%',
        marginBottom: 16
    },

    filterGroup: {
        flexDirection: 'column',
        minWidth: 120,
        rowGap: 8,
        marginBottom: 8
    },

    filterGroupButton: {
        flexDirection: 'row',
        minWidth: 120,
        columnGap: 8,
        marginBottom: 8
    },

    buttonRow: { marginLeft: 8 },

    scrollContainer: {
        height: '85%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15
    },

    filterDate: {
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 2,
        height: 32,
        paddingHorizontal: 11
    },

    btnSection: {
        flexDirection: 'row'
    }
});
