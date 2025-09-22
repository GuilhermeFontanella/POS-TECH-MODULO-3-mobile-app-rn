import Navbar from "@/components/navbar/Navbar";
import NewTransactionCard from "@/components/newTransactionCard/NewTransactionCard";
import WelcomeCard from "@/components/welcomeCard/WelcomeCard";
import React, { useEffect, useRef, useState } from "react";
import { findNodeHandle, InteractionManager, SafeAreaView, ScrollView, StyleSheet, UIManager, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PortalHost } from "@rn-primitives/portal";
import Transactions from "@/components/transactions/Transactions";
import UserService from "./user.service";
import { IUser } from "./models/user.interface";


function MainPage() {  
    const userService: UserService = new UserService();
    const [user, setUser] = useState<IUser | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);

    const style = StyleSheet.create({
        navbar: {
            zIndex: 1
        },
    });

    const getUserTransactions = async () => {
        if (user) {
            try {
                const response = await userService.getUserTransactions(user.id);
                //console.log(response)
                setTransactions(response);
            } catch (error: any) {
                throw Error(error);
            }
        }
    }

    const getUserInfo = async () => {
        try {
            const response = await userService.getAccountInfo();
            setUser(response);
            return response;
        } catch (error: any) {
            throw Error(error);
        }
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        if (user) getUserTransactions();
    }, [user]);


    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <KeyboardAwareScrollView
                enableOnAndroid={true}
                extraScrollHeight={24}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                    {user && (
                        <View>
                            <View style={style.navbar}>
                                    <Navbar />
                            </View>
                            <View>
                                <WelcomeCard user={user} />
                            </View>
                            <View>
                                <NewTransactionCard user={user} onRegister={() => getUserTransactions()} />
                            </View>
                            <View>
                                <Transactions transactions={transactions} />
                            </View>
                        </View>
                    )}
                </KeyboardAwareScrollView>
            </SafeAreaView>
            <PortalHost />
        </SafeAreaProvider>
    )
}

export default MainPage;