import { Link, useRouter } from "expo-router";
import * as React from 'react';
import { View } from 'react-native';
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
import "../global.css";


export default function Login() {
    const router = useRouter();

    return (
        <View style={{backgroundColor: 'red', height: '100%'}}>
            <Card style={{margin: 'auto'}} className="w-full max-w-sm">
            <CardHeader className="flex-row">
                <View className="flex-1 gap-1.5">
                <CardTitle>Acesse a sua conta</CardTitle>
                <CardDescription>Insira seu e-mail e senha</CardDescription>
                </View>
            </CardHeader>
            <CardContent>
                <View className="w-full justify-center gap-4">
                <View className="gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="m@example.com" />
                </View>
                <View className="gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="name" placeholder="John Doe" />
                </View>
                </View>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button className="w-full" onPress={() => router.navigate('/mainPage')}>
                <Text>Entrar</Text>
                </Button>
                <Link href={"/"} className="w-full" style={{color: 'white'}}>Esqueci a minha senha</Link>
            </CardFooter>
            </Card>

        </View>

    )
}