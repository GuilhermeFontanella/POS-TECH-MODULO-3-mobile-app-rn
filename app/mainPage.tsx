import Navbar from "@/components/navbar/Navbar";
import NewTransactionCard from "@/components/newTransactionCard/NewTransactionCard";
import WelcomeCard from "@/components/welcomeCard/WelcomeCard";
import React, { useRef, useState } from "react";
import { findNodeHandle, InteractionManager, SafeAreaView, ScrollView, StyleSheet, UIManager, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PortalHost } from "@rn-primitives/portal";


export default function MainPage() {  
    const style = StyleSheet.create({
        navbar: {
            zIndex: 1
        },
    });

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <KeyboardAwareScrollView
                enableOnAndroid={true}
                extraScrollHeight={24} // espaço extra quando teclado abre
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <View style={style.navbar}>
                        <Navbar />
                    </View>
                    <View>
                        <WelcomeCard />
                    </View>
                    <View>
                        <NewTransactionCard />
                    </View>

                </KeyboardAwareScrollView>
            </SafeAreaView>
            <PortalHost />
        </SafeAreaProvider>
    )
}