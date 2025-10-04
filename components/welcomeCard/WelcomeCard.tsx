import React, { use, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Button, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { User } from '@/app/transaction.service';
import UserService from '@/app/user.service';
import transactionService, { Transaction } from '@/app/transaction.service';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';


const screenWidth = Dimensions.get('window').width;

type DesempenhoData = {
  labels: string[];
  datasets: { data: number[] }[];
};

type GastosData = {
  labels: string[];
  datasets: { data: number[] }[];
}

function formatCurrencyBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function DashboardScreen() {
  const [showAmmount, setShowAmmount] = useState(true);
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [metaEconomia, setMetaEconomia] = useState(5000);
  const [users, setUsers] = useState<User[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [transactionsGraphic, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<{ date?: Date; type?: string }>({});
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [desempenhoData, setDesempenhoData] = useState<DesempenhoData>({ labels:[], datasets: [{ data:[] }] });
  const [gastosData, setGastosData] = useState<GastosData>({ labels: [], datasets: [{ data: [] }] });


   useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await UserService.getUsers();
        setUsers(data);
        console.log("Users fetched:", data);
        {users.map((user) => (
          user.name
          ))}
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } 
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const unsubscribe = transactionService.subscribeTransactions(setTransactions);
    return () => unsubscribe();
  }, []);

useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "transactions"), snapshot => {
    const transactions: Transaction[] = snapshot.docs.map(doc => ({
      ...(doc.data() as Transaction),
    })); 

    const total = calcularTotal(transactions);
    setTotalAmount(total);
    console.log("Total atualizado:", total)
  });

  return () => unsubscribe();
}, []);



useEffect(() => {
  let result = [...transactionsGraphic];
  if (!transactionsGraphic.length) return;

  const meses: string[] = [];
  const valoresPorMes: number[] = [];

  const agrupado = transactionsGraphic.reduce((acc, t) => {
    const mes = t.month;
    const total = t.categoria.reduce((sum, cat) => 
      cat.type === "income" ? sum += cat.amount : sum -= cat.amount, 0) || 0;

    if (!acc[mes]) acc[mes] = 0;
    acc[mes] += total;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(agrupado).forEach(([mes, valor]) => {
    meses.push(mes);
    valoresPorMes.push(valor);
  });
  setDesempenhoData({
    labels: meses,
    datasets: [{ data: valoresPorMes }]
  }); 
  }, [transactionsGraphic]);
  

  useEffect(() => {
  if (!transactionsGraphic.length) return;

  // Agrupa por categoria
  const categorias: Record<string, number> = {};

  transactionsGraphic.forEach((t) => {
    t.categoria.forEach((cat) => {
      if (!categorias[cat.description]) categorias[cat.description] = 0;
      cat.type === "income" ? categorias[cat.description] += Math.abs(cat.amount) || 0 :
      categorias[cat.description] += -Math.abs(cat.amount)
    });
  });

  const labels = ['Transferência', 'Depósito', 'Despesa'];
  const data = Object.values(categorias);
  console.log('Gastos', labels, "=>", data) 

  setGastosData({
    labels,
    datasets: [{ data }]
  });
}, [transactionsGraphic]);
  

const calcularTotal = (transactions: Transaction[]): number => {
  if (!Array.isArray(transactions)) return 0;

  return transactions.reduce((acc, t) => {
    const soma = t.categoria?.reduce((sum, c) => {
      const valor = typeof c.amount === "number" ? Math.abs(c.amount) : 0;
      return c.type === "income" ? sum + valor : sum - valor;
    }, 0) || 0;

    return acc + soma;
  }, 0);
};

  // Data de hoje formatada
  const todayDate = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <View style={styles.container}>
      {/* Card de boas-vindas */}
      {/* <View style={styles.card}> */}
      <Text style={styles.title}>Olá, {users[1]?.name}! :)</Text>
      <Text style={styles.date}>{todayDate}</Text>
      <View style={styles.accountInfo}>
        <View style={styles.showAmmountButton}>
          <Text style={styles.subtitle}>Saldo</Text>
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowAmmount(!showAmmount)}
          >
            <Ionicons
              name={showAmmount ? 'eye' : 'eye-off'}
              size={24}
              color="#DEE9EA"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.ammountInfo}>
          <Text style={styles.accountType}>Conta Corrente</Text>
          <Text style={styles.ammount}>
            {showAmmount ? formatCurrencyBRL(totalAmount) : 'R$ *******'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.dashboardButton}
        onPress={() => setDashboardVisible(true)}
      >
        <Text style={{ color: '#FFF', fontSize: 16 }}>📊 Visualizar Dashboard</Text>
      </TouchableOpacity>
      {/* </View> */}

      {/* Modal do Dashboard */}
      <Modal
        visible={dashboardVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDashboardVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setDashboardVisible(false)}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}>✖ Fechar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Dashboard Financeiro</Text>
            <View style={styles.charts}>
              <Text style={styles.chartTitle}>Desempenho</Text>
              <LineChart
                data={desempenhoData}
                width={screenWidth * 0.80}
                height={180}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
              <Text style={styles.chartTitle}>Gastos</Text>
              <BarChart
                data={gastosData}
                width={screenWidth * 0.80}
                height={180}
                chartConfig={chartConfig}
                style={styles.chart}
                yAxisLabel=""
                yAxisSuffix=""
              />
            </View>
            {/* Meta de economia editável */}
            <View style={styles.widget}>
              <Text style={styles.widgetTitle}>Meta de Economia</Text>
              <Text style={styles.widgetValue}>{formatCurrencyBRL(metaEconomia)}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button title="-" onPress={() => setMetaEconomia(Math.max(1000, metaEconomia - 500))} />
                <Text style={{ marginHorizontal: 10 }}>{metaEconomia}</Text>
                <Button title="+" onPress={() => setMetaEconomia(Math.min(20000, metaEconomia + 500))} />
              </View>
            </View>
            {/* Alerta de Gastos */}
            <View style={[styles.widget, styles.alerta]}>
              <Text style={styles.widgetTitle}>Alerta de Gastos</Text>
              <Text>Você está dentro do limite de gastos!</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Configuração do gráfico
const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.7,
  decimalPlaces: 0,
};

const styles = StyleSheet.create({
  // container: { flex: 1, backgroundColor: '#f5f6fa', alignItems: 'center', justifyContent: 'center' },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 16,
    backgroundColor: '#004D61',
    borderRadius: 8,
    minWidth: 282,
    width: '100%',
    minHeight: 480,
    paddingRight: 10
  },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 24, width: '90%', elevation: 3, marginBottom: 20 },
  title: {
    fontSize: 25, fontWeight: "600",
    display: "flex",
    borderRadius: 8,
    color: "#DEE9EA",
    alignItems: "center",
    marginBottom: 5
  },
  date: { fontSize: 16, color: '#DEE9EA', marginBottom: 16 },
  accountInfo: { marginTop: 10 },
  showAmmountButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subtitle: { fontSize: 20, fontWeight: '600', color: "#DEE9EA", },
  eyeButton: { marginLeft: 10,  borderRadius: 20, padding: 4 },
  divider: { height: 1, backgroundColor: '#DEE9EA', marginVertical: 10, width: '100%' },
  ammountInfo: { alignItems: 'flex-start' },
  accountType: { fontSize: 14, color: '#DEE9EA' },
  ammount: { fontSize: 31, fontWeight: '400', marginTop: 2, color: "#DEE9EA", },
  dashboardButton: { marginTop: 60, backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  overlay: { flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 12,
    marginTop: 12,
    
  },
  modal: { backgroundColor: '#fff', borderRadius: 12, padding: 14, width: '92%', alignItems: 'center', marginTop: 15},
  closeBtn: { alignSelf: 'flex-end', backgroundColor: '#ff3b30', borderRadius: 20, padding: 8, marginBottom: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  charts: { width: '100%', alignItems: 'center', marginBottom: 20 },
  chart: { marginVertical: 10, borderRadius: 8, borderColor: '#ff3b30',borderWidth: 1,},
  chartTitle: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  widget: { backgroundColor: '#f1f2f6', borderRadius: 8, padding: 12, marginVertical: 8, width: '100%', alignItems: 'center' },
  widgetTitle: { fontSize: 16, fontWeight: 'bold' },
  widgetValue: { fontSize: 18, fontWeight: 'bold', marginVertical: 4 },
  alerta: { backgroundColor: '#ffe5e5' },
});
