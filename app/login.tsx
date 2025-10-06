import "../global.css";
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Text } from '../components/ui/text';
import { View } from 'react-native';
import { Link, useRouter } from "expo-router";
import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";



export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 16}}>
            <Card style={{margin: 'auto'}} className="w-full max-w-sm">
            <CardHeader className="flex-row">
                <View className="flex-1 gap-1.5">
                <CardTitle>Login</CardTitle>
                <CardDescription>Insira seu e-mail e senha</CardDescription>
                </View>
            </CardHeader>
            <CardContent>
                <View className="w-full justify-center gap-4">
                <View className="gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="m@example.com" 
                    value={email}  
                    onChangeText={setEmail}/>
                </View>
                <View className="gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" placeholder="********"
                    value={password}
                    onChangeText={setPassword} 
                    secureTextEntry={true}/>
                </View>
                
                </View>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button className="w-full" onPress={async () => {
                    try {
                      const isAuthenticated = await login(email, password);
                      if (isAuthenticated) {
                        router.replace('/mainPage');
                        console.log('Login successful');
                      }
                    } catch (err) {
                      console.error('login error', err);
                    }
                  }}>
                <Text>Entrar</Text>
                </Button>
                <View className="gap-2">
                     <Link href="/signup" style={{ marginTop: 16 }}>Don't have an account? Sign up</Link>
                </View>
                <Link href={"/"} className="w-full" style={{color: 'white'}}>Esqueci a minha senha</Link>
            </CardFooter>
            </Card>
        </View>

    )
}