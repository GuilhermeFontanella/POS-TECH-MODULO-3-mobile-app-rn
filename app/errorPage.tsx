import React from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

interface ErrorScreenProps {
  title?: string;
  message?: string;
  imageSource?: any;
  backRoute?: string;
  buttonLabel?: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ 
  title = "Ops! Não encontramos a página…",
  message = "E olha que exploramos o universo procurando por ela!\nQue tal voltar e tentar novamente?",
  imageSource = require("../assets/images/error.png"),
  backRoute,
  buttonLabel = "Voltar ao início",
 }) => {
  const router = useRouter();

  const handleBack = () => {
    if (backRoute) {
      router.replace(backRoute as any);
    } else {
      router.back();
    }
  };

  return (
    <LinearGradient
      colors={['#014455ff', '#FFFFFF']} 
      style={styles.container}>
      <SafeAreaView style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        <Image
          source={imageSource} 
          style={styles.image}
          resizeMode="contain"/>

        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 130

  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 32,
    color: '#3F3D56'
  },
  button: {
    backgroundColor: '#FF4D3E',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 2,
     marginTop: 40
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorScreen;
