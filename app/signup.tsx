import "../global.css";
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
import {
  Card,
  CardContent,
  CardFooter
} from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function Signup() {

  const { signUp } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16}}>
        <Card style={{margin: 'auto'}} className="w-full max-w-sm">
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
                        <Input id="password" placeholder="John Doe"
                        value={password}
                        onChangeText={setPassword} />
                    </View>
                </View>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button className="w-full" onPress={() => {
                    signUp(email, password)}}>
                    <Text style={{color: 'white'}}>Sign Up</Text>
                </Button>
                    <View className="gap-2">
                        <Link href="/login" style={{ marginTop: 16 }}>Already have an account? Log in</Link>
                    </View>  
            </CardFooter>  
        </Card>  
    </View>
  )
}


//     <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
//       <Text style={{ fontSize: 24, marginBottom: 16 }}>Sign Up</Text>
      
//       <TextInput 
//         placeholder="Email" 
//         style={{ borderWidth: 1, marginBottom: 16, padding: 8 }} 
//         value={email}  
//         onChangeText={setEmail}
//       />
      
//       <TextInput 
//         placeholder="Password" 
//         secureTextEntry 
//         style={{ borderWidth: 1, marginBottom: 16, padding: 8 }} 
//         value={password}
//         onChangeText={setPassword}  
//       />
      
//       <Button title="Sign Up" onPress={() => {
        
//         signUp(email, password)
        

//       }} />
//       <Link href="/login" style={{ marginTop: 16 }}>Already have an account? Log in</Link>
//     </View>
//   );
// }