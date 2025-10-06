import Navbar from "@/components/navbar/Navbar";
import NewTransactionCard from "@/components/newTransactionCard/NewTransactionCard";
import WelcomeCard from "@/components/welcomeCard/WelcomeCard";
import React, { useEffect, useRef, useState } from "react";
import { findNodeHandle, InteractionManager, SafeAreaView, ScrollView, StyleSheet, UIManager, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PortalHost } from "@rn-primitives/portal";
import Transactions from "@/components/transactions/Transactions";
import { IUser } from "./models/user.interface";
import transactionService from "./transaction.service";
import userService from "./user.service";




function MainPage() {
    const style = StyleSheet.create({
        navbar: {
            zIndex: 1
        },
    });

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                    enableOnAndroid={true}
                    extraScrollHeight={24}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
                    {(
                        <View>
                            <View style={style.navbar}>
                            <Navbar />
                            </View>
                            <WelcomeCard />
                            <NewTransactionCard />
                            <Transactions />
                        </View>
                    )}
                </KeyboardAwareScrollView>
            </SafeAreaView>
            <PortalHost name="root" />
        </SafeAreaProvider>
    )
}

export default MainPage;