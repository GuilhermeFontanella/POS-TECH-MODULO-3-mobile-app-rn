// ...existing code...
import { Link, useRouter } from "expo-router";
import * as React from 'react';
import { ActivityIndicator, Text, View } from "react-native";
import '../global.css';
import { useEffect } from "react";

function Index() {
    const router = useRouter();

  useEffect(() => {
   const t = setTimeout(() => {
      router.replace('/login');
    }, 0);
    return () => clearTimeout(t);
  }, []);

    return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator size="large" />
    </View>
    )
}

export default Index;