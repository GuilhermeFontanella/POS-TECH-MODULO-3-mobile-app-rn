import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, TextInput, Image, Linking, StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import PixelTop from '@/assets/images/Pixels3.png';
// import PixelBottom from '@/assets/images/Pixels4.png';
import transactionService, { Transaction } from '@/app/transaction.service';
import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function NewTransactionCard() {
  const [receiptName, setReceiptName] = useState<string | null>(null);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [isPDF, setIsPDF] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typeselected, setTypeSelected] = useState<string | null>(null);
  const [value, setValue] = useState("");;

  /** ---------- Upload do Recibo ---------- */
  const onFileSelected = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
    });
    if (result.canceled) return;

    const file = result.assets[0];
    setReceiptName(file.name);
    setReceiptPreviewUrl(file.uri);

    const mime = file.mimeType || "";
    setIsImage(mime.includes("image"));
    setIsPDF(mime.includes("pdf"));
  };


  const selectOption = (key: string, label: string) => {
    setSelectedOption(label);
    setIsDropdownOpen(false);
    setTypeSelected(key); 
  };

  // const addTransaction = () => {
  //   console.log("Nova transação:", { selectedOption, value, receiptName });
  // };

  const addTransaction = async () => {
    try {
      if (!selectedOption || !value || isNaN(Number(value))) {
        alert("Preencha todos os campos obrigatórios corretamente.");
        return;
      }

      const now = new Date();
      const month = now.toLocaleString("pt-BR", { month: "long" });

      const categoria = {
        id: Date.now().toString(),
        description: selectedOption,
        date: now.toISOString().split("T")[0],
        type: typeselected,
        amount: Number(value),
        document: {
          name: receiptName || null,
          previewUrl: receiptPreviewUrl || null,
          format: isImage ? "image" : isPDF ? "pdf" : null,
        },
      };

      const q = query(collection(db, "transactions"), where("month", "==", month));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        const existingData = snapshot.docs[0].data();
        const updatedCategoria = [...existingData.categoria, categoria];

        await updateDoc(docRef, { categoria: updatedCategoria });
        console.log("✏️ Categoria adicionada à transação existente");
      } else {
        await addDoc(collection(db, "transactions"), {
          month,
          categoria: [categoria],
          createdAt: now.toISOString(),
        });
        console.log("🆕 Nova transação criada");
      }

      // Limpa os campos após salvar
      setSelectedOption(null);
      setValue("");
      setReceiptName(null);
      setReceiptPreviewUrl(null);
      setIsImage(false);
      setIsPDF(false);
      setIsDropdownOpen(false);
      console.log("Transação salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.uploadBtn} onPress={onFileSelected}>
          <MaterialIcons name="attach-file" size={20} color="#004D61" />
          <Text style={styles.label}>Selecionar arquivo (opcional)</Text>
        </TouchableOpacity>

        {isImage && receiptPreviewUrl && (
          <Image source={{ uri: receiptPreviewUrl }} style={styles.previewImg} />
        )}

        {isPDF && receiptPreviewUrl && (
          <TouchableOpacity style={styles.fileInfo} onPress={() => Linking.openURL(receiptPreviewUrl)}>
            <Text style={{ color: "blue" }}>📄 Visualizar Recibo PDF</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Nova Transação</Text>
        {/* <View style={{ flex:1, justifyContent: 'center', alignContent: 'flex-end', width: '50%', height: '70%', position: 'absolute', bottom: 76, right: 165, borderRadius: 20,}}>
          <Image
              source={PixelTop}
              className="absolute bottom-0 left-0 right-0 top-0 object-cover"
              style={{ width: '100%', height: '550%', borderRadius: 8, backgroundColor: "#00000001", }}
          />
        </View> */}
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={{ position: "relative", zIndex: 9999 }}>
          <TouchableOpacity style={styles.dropdown} onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Text>{selectedOption || "Selecione o tipo de transação"}</Text>
            <MaterialIcons name={isDropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} />
          </TouchableOpacity>

          {isDropdownOpen && (
            <View style={styles.dropdownOptions}>
              <TouchableOpacity style={styles.option} onPress={() => selectOption("income", "Depósito")}>
                <Text>Depósito</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={() => selectOption("expense", "Despesa")}>
                <Text>Despesa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={() => selectOption("transfer", "Transferência")}>
                <Text>Transferência</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Input de valor */}
        <View style={styles.valorInputContainer}>
          <Text style={styles.titleValor}>Valor</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder="00,00"
            keyboardType="numeric"
          />
        </View>

        {/* Botão */}
        <TouchableOpacity style={styles.primaryBtn} onPress={addTransaction}>
          <Text style={{ color: "#fff" }}>Concluir transação</Text>
        </TouchableOpacity>
        {/* <View style={{ flex:1, justifyContent: 'center', alignContent: 'flex-end', width: '50%', height: '60%', position: 'absolute', top: 265, left: 175, borderRadius: 20,}}>
          <Image
              source={PixelBottom}
              alt="Photo by Drew Beamer (https://unsplash.com/@dbeamer_jpg)"
              className="absolute bottom-0 left-0 right-0 top-0 object-cover"
              style={{ width: '100%', height: '100%', borderRadius: 8, backgroundColor: "#00000001" }}
          />
      </View>  */}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 16,
    backgroundColor: "#CBCBCB",
    borderRadius: 8,
    minWidth: 282,
    width: '100%',
    minHeight: 480,
    paddingRight: 10
  },
  inputContainer: { marginBottom: 16 },
  label: { fontWeight: "bold", marginLeft: 16 },
  uploadBtn: { flexDirection: "row", alignItems: "center", padding: 8, borderWidth: 1, borderColor: "#ccc", borderRadius: 6 },
  fileInfo: { flexDirection: "row", alignItems: "center", marginLeft: 16 },
  viewBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#004D61", padding: 6, borderRadius: 8, marginLeft: 8 },
  previewImg: { width: 100, height: 100, marginTop: 8 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  valorInputContainer: { marginTop: 12, alignItems: "center", marginBottom: 15, width: '100%' },
  titleValor: {
    fontSize: 15, fontWeight: "600",
    display: "flex",
    borderRadius: 8,
    color: "#DEE9EA",
    alignItems: "center",
    marginBottom: 5
  },
  title: {
    fontSize: 20, fontWeight: "700",
    display: "flex",
    marginBottom: 5,
    borderRadius: 8,
    color: "#DEE9EA"
  },
  form: { marginTop: 0 },
  dropdown: { flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 6,
    padding: 12, 
    backgroundColor: "#fff", 
    width: '100%',
    borderWidth: 1, 
    borderColor: "#ccc",
     borderRadius: 8 },
  dropdownOptions: { position: "absolute", 
    top: "100%",          
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 4,
    zIndex: 9999,           
    elevation: 5, },
  option: { padding: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, backgroundColor: "#fff", width: '60%' },
  primaryBtn: { backgroundColor: "#004D61", padding: 12, borderRadius: 8, alignItems: "center", flex: 1, justifyContent: 'flex-end', top: 100 },
});
