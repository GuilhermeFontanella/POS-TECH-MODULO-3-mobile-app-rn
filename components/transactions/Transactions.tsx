
import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    FlatList, Modal, StyleSheet,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import transactionService, { Transaction } from '@/app/transaction.service';



const formatCurrencyBRL = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatDateBR = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR');

interface TransactionsProps {
    transactions: any[];
}

export default function Transactions() {
  const [filters, setFilters] = useState<{ date?: Date; type?: string }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [mensagemErro, setMensagemErro] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [editFields, setEditFields] = useState({
    description: "",
    type: "income",
    amount: "",
    date: "",
    month: "",
  });

//🔄 usar para incluir mais dados no banco se nescessario
//   useEffect(() => {
//   transactionService.populateFirebase();
// }, []);

  // 🔄 Carrega transações em tempo real
  useEffect(() => {
    const unsubscribe = transactionService.subscribeTransactions(setTransactions);
    return () => unsubscribe();
  }, []);

  // 🔍 Aplica filtros sempre que filtros ou transações mudam
  useEffect(() => {
    applyFilters();
  }, [filters, transactions]);

  const applyFilters = () => {
    let result = [...transactions];
    if (filters.type) {
      result = result
        .map((t) => ({
          ...t,
          categoria: t.categoria.filter((c) => c.type === filters.type),
        }))
        .filter((t) => t.categoria.length);
    }
    if (filters.date) {
      const d = filters.date.toISOString().split("T")[0];
      result = result
        .map((t) => ({
          ...t,
          categoria: t.categoria.filter((c) => c.date.startsWith(d)),
        }))
        .filter((t) => t.categoria.length);
    }
    setFiltered(result);
    setMensagemErro(result.length === 0 ? "Nenhuma transação encontrada com os filtros aplicados." : "");
  };

  const clearFilters = () => {
    setFilters({});
    setMensagemErro("");
  };

  const openEditModal = (transactionId: string, item: any, month: string) => {
    setEditItem({ transactionId, itemId: item.id });
    setEditFields({
      description: item.description,
      type: item.type,
      amount: item.amount.toString(),
      date: item.date,
      month: item.month || month,
    });
    setShowEditModal(true);
  };
  
  const saveEdit = async () => {
    try {
    if (!editFields.description || !editFields.amount) return;
    if (!editItem?.transactionId || !editFields.description || !editFields.amount) {
    alert("Preencha todos os campos obrigatórios");
}
    const updatedTransactions = transactions.map((t) => {
      if (t.id !== editItem.transactionId) return t;
      return {
        ...t,
        categoria: t.categoria.map((c) =>
          c.id === editItem.itemId
            ? {
                ...c,
                description: editFields.description,
                amount: parseFloat(editFields.amount),
                date: editFields.date,
                month: editFields.month,
              }
            : c
        ),
      };
    });
    // Atualiza no Firestore
    await transactionService.updateTransaction(editItem.transactionId, {
      categoria: updatedTransactions.find((t) => t.id === editItem.transactionId)?.categoria || [],
    });
    setShowEditModal(false);
}  catch (error) {
    console.error("Erro ao salvar edição:", error);
    alert("Erro ao salvar edição. Verifique os dados e tente novamente.");
  } 
  };


  const deleteCategoria = async (transactionId: string, itemId: string): Promise<void> => {
  try {
    // Atualiza o estado local
    setTransactions(prevTransactions => {
      return prevTransactions.map(transaction => {
        if (transaction.id !== transactionId) return transaction;

        const novaCategoria = transaction.categoria.filter(c => c.id !== itemId);
        return { ...transaction, categoria: novaCategoria };
      }).filter(transaction => transaction.categoria.length > 0);
    });

    // Busca a transação original
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;
 
    // Filtra a categoria atualizada 
    const updatedCategoria = transaction.categoria.filter(c => c.id !== itemId);

    // Atualiza ou remove no Firestore
    if (updatedCategoria.length === 0) {
      const delet = await transactionService.deleteTransaction(transactionId);
    } else { 
     const update =  await transactionService.updateTransaction(transaction.id, { categoria: updatedCategoria });
    }
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
  }
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
                        <Picker.Item label="Mes" value="month" />
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
                        keyExtractor={t => t.id.toString()}
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
    inputType: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginRight: 2, },
    btnCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0', marginLeft: 5 },
    alert: { color: 'red', margin: 20 },
    month: { fontSize: 14, fontWeight: '600', marginTop: 12, color: '#47A138', },
    selectData: { fontSize: 16, fontWeight: '600', marginTop: 16 },
    itemRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#47A138' },
    amount: { fontSize: 16, color: '#000000', fontWeight: '600', },
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
        minHeight: 480,
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
        columnGap: 16 
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
