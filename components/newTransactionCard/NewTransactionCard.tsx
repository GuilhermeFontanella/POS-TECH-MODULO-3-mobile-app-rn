// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   TextInput,
//   Linking,
//   ScrollView,
//   Alert,
// } from "react-native";
// import * as DocumentPicker from "expo-document-picker";
// import { IUser } from "@/app/models/user.interface";
// import UserService from "@/app/user.service";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Picker } from "@react-native-picker/picker";

// type TransactionType = "cambio" | "docted" | "emprestimo" | null;


// interface NewTransactionCardProps {
//   user: IUser,
//   onRegister: () => void;
// }


// export default function NewTransactionScreen({ user, onRegister }: NewTransactionCardProps) {
//   const [receiptName, setReceiptName] = useState<string | null>(null);
//   const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(null);
//   const [isImage, setIsImage] = useState(false);
//   const [isPDF, setIsPDF] = useState(false);

//   const service: UserService = new UserService();
//   const insets = useSafeAreaInsets();


//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedType, setSelectedType] = useState<TransactionType>(null);
//   const [formattedValue, setFormattedValue] = useState("");

//   /** ---------- Upload do Recibo ---------- */
//   const onFileSelected = async () => {
//     const result = await DocumentPicker.getDocumentAsync({
//       type: ["image/*", "application/pdf"],
//     });
//     if (result.canceled) return;

//     const file = result.assets[0];
//     setReceiptName(file.name);
//     setReceiptPreviewUrl(file.uri);

//     const mime = file.mimeType || "";
//     setIsImage(mime.includes("image"));
//     setIsPDF(mime.includes("pdf"));
//   };

//   const abrirRecibo = () => {
//     if (receiptPreviewUrl) Linking.openURL(receiptPreviewUrl);
//   };

//   /** ---------- Dropdown ---------- */
//   const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

//   const selectOption = (type: TransactionType) => {
//     setSelectedType(type);
//     setIsDropdownOpen(false);
//   };

//   /** ---------- Valor formatado ---------- */
//   const onValueChange = (text: string) => {
//     const clean = text.replace(/\D/g, "");
//     const value = (Number(clean) / 100).toLocaleString("pt-BR", {
//       style: "currency",
//       currency: "BRL",
//     });
//     setFormattedValue(value);
//   };

//   /** ---------- Concluir ---------- */
//   const addTransaction = () => {
//     console.log("add transaction");
//     Alert.alert(
//       "Transação",
//       `Tipo: ${selectedType || "não selecionado"}\nValor: ${formattedValue || "0"}\nRecibo: ${receiptName || "nenhum"
//       }`
//     );
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Upload de Recibo */}
//       <View style={styles.section}>
//         <Text style={styles.label}>Recibo (opcional)</Text>
//         <TouchableOpacity style={styles.fileButton} onPress={onFileSelected}>
//           <Text style={styles.fileButtonText}>Selecionar arquivo</Text>
//         </TouchableOpacity>

//         {receiptName && (
//           <View style={styles.fileInfo}>
//             <Text style={{ marginRight: 16 }}>📄 {receiptName}</Text>
//             <TouchableOpacity style={styles.viewButton} onPress={abrirRecibo}>
//               <Text style={styles.viewButtonText}>Ver recibo</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {isImage && receiptPreviewUrl && (
//           <Image source={{ uri: receiptPreviewUrl }} style={styles.previewImg} />
//         )}
//         {isPDF && receiptPreviewUrl && (
//           <TouchableOpacity onPress={abrirRecibo}>
//             <Text style={styles.pdfLink}>📄 Visualizar Recibo PDF</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>Nova Transação</Text>
//       </View>

//       {/* Dropdown customizado */}

//       <View style={styles.section}>
//         <Picker
//           selectedValue={selectedType}
//           style={styles.dropdown}    
//           onValueChange={(value) => selectOption(value as TransactionType)}
//         >
//           <Picker.Item label="Selecione o tipo de transação" value="" />
//           <Picker.Item label="Câmbio de Moeda" value="cambio" />
//           <Picker.Item label="DOC/TED" value="docted" />
//           <Picker.Item label="Empréstimo e Financiamento" value="emprestimo" />
//         </Picker>
//       </View>

//       {/* <View style={styles.section}>
//         <TouchableOpacity
//           style={[styles.dropdown, isDropdownOpen && styles.dropdownOpen]}
//           onPress={toggleDropdown}
//         >
//           <Text style={styles.dropdownText}>
//             {selectedType
//               ? {
//                   cambio: "Câmbio de Moeda",
//                   docted: "DOC/TED",
//                   emprestimo: "Empréstimo e Financiamento",
//                 }[selectedType]
//               : "Selecione o tipo de transação"}
//           </Text>
//         </TouchableOpacity>

//         {isDropdownOpen && (
//           <View style={styles.dropdownOptions}>
//             {[
//               { key: "cambio", label: "Câmbio de Moeda" },
//               { key: "docted", label: "DOC/TED" },
//               { key: "emprestimo", label: "Empréstimo e Financiamento" },
//             ].map((opt) => (
//               <TouchableOpacity
//                 key={opt.key}
//                 style={[
//                   styles.option,
//                   selectedType === opt.key && styles.optionSelected,
//                 ]}
//                 onPress={() => selectOption(opt.key as TransactionType)}
//               >
//                 <Text>{opt.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//       </View> */}

//       {/* Valor */}
//       <View style={styles.section}>
//         <Text style={styles.label}>Valor</Text>
//         <TextInput
//           style={styles.input}
//           value={formattedValue}
//           onChangeText={onValueChange}
//           keyboardType="numeric"
//           placeholder="00,00"
//         />
//       </View>

//       {/* Botão */}
//       <TouchableOpacity style={styles.primaryBtn} onPress={addTransaction}>
//         <Text style={styles.primaryBtnText}>Concluir transação</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   // container: {
//   //   padding: 20,
//   //   minHeight: 302,
//   //   display: "flex",
//   //   backgroundColor: "#CBCBCB",
//   //   borderRadius: 8,
//   //   margin: 16,
//   // },
//   container: {
//         flexDirection: 'column',
//         alignItems: 'center',
//         paddingTop: 16,
//         marginTop: 16,
//         backgroundColor: "#CBCBCB",
//         borderRadius: 8,
//         minWidth: 282,
//         width: '96%',
//         minHeight: 480, // equivalente a calc(100vh - 96px)
//         paddingRight: 10
//     },
//   section: { marginBottom: 24 },
//   label: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginRight: 5 },
//   fileButton: {
//     padding: 12,
//     backgroundColor: "#004D61",
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   fileButtonText: { color: "#fff" },
//   fileInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 12,
//   },
//   viewButton: {
//     backgroundColor: "#004D61",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   viewButtonText: { color: "#fff" },
//   previewImg: {
//     width: "100%",
//     height: 200,
//     marginTop: 12,
//     borderRadius: 8,
//   },
//   pdfLink: { color: "#007bff", marginTop: 12 },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 20, fontWeight: "700",
//     display: "flex",
//     borderRadius: 8,
//     color: "#DEE9EA"

//   },
//   headerImg: { display: "flex", justifyContent: "space-between", zIndex: 1 },
//   imagemHeader: { position: "absolute", zIndex: 0, right: 0, top: 0 },
//   dropdown: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginRight: 5 },
//   // dropdownOpen: { borderColor: "#007bff" },
//   // dropdownText: { color: "#333" },
//   // dropdownOptions: {
//   //   marginTop: 4,
//   //   borderWidth: 1,
//   //   borderColor: "#ccc",
//   //   borderRadius: 8,
//   //   backgroundColor: "#fff",
//   // },
//   option: { padding: 12 },
//   optionSelected: { backgroundColor: "#e0f7fa" },
//   input: {
//     borderWidth: 1,
//     borderColor: "#004D61",
//     borderRadius: 8,
//     padding: 14,
//     backgroundColor: "#fff",
//     color: "#333",
//   },
//   primaryBtn: {
//     backgroundColor: "#004D61",
//     paddingVertical: 16,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 16,
//   },
//   primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },

// });


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
        type: "income",
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
              <TouchableOpacity style={styles.option} onPress={() => selectOption("cambio", "Câmbio de Moeda")}>
                <Text>Câmbio de Moeda</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={() => selectOption("docted", "DOC/TED")}>
                <Text>DOC/TED</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={() => selectOption("emprestimo", "Empréstimo e Financiamento")}>
                <Text>Empréstimo e Financiamento</Text>
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
    width: '96%',
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
