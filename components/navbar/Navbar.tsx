import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/text';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlignJustify, Home, User } from 'lucide-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'expo-router';
import React from 'react'

export default function Navbar() {
    const router = useRouter();

    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: insets.bottom,
        left: insets.left,
        right: insets.right,
    };

    const styles = StyleSheet.create({
        container: {
            width: "100%",
            paddingRight: 15,
            paddingLeft: 15,
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
            marginTop: 30,
            flexDirection: 'row'
        },
        menuBar: {
            height: 130,
            alignSelf: 'stretch',
            width: "100%",
            backgroundColor: '#004D61'
        },
        avatar: {
            height: 45,
            width: 45
        }
    })

    return (
        <View style={styles.menuBar}>
            <View style={styles.container}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size={'icon'} variant="ghost">
                            <AlignJustify color={"#FF5031"} size={32} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent insets={contentInsets} sideOffset={-20} className="w-56" align="start">
                        <DropdownMenuGroup>
                            <DropdownMenuItem onPress={() => router.push('/mainPage')}>
                                <Text variant={'p'} >Início</Text>
                            </DropdownMenuItem>
                            <DropdownMenuItem onPress={() => router.push('/+not-found')}>
                                <Text variant={'p'}>Transferências</Text>
                            </DropdownMenuItem>
                            <DropdownMenuItem onPress={() => router.push('/+not-found')}>
                                <Text variant={'p'}>Investimentos</Text>
                            </DropdownMenuItem>
                            <DropdownMenuItem onPress={() => router.push('/+not-found')}>
                                <Text variant={'p'}>Outros serviços</Text>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                    </DropdownMenuContent>
                </DropdownMenu>
                <Avatar  style={styles.avatar} alt="Zach Nugent's Avatar">
                    <AvatarFallback>
                        <User color={"#FF5031"} />
                    </AvatarFallback>
                </Avatar>
            </View>
        </View>
    )
}