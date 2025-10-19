import { Stack } from 'expo-router';

export default function FarmerViews() {

    return (
        <Stack>
            <Stack.Screen name="(home)" options={{headerShown: false}} />
            <Stack.Screen name="(products)" options={{headerShown: false}} />
            <Stack.Screen name="(orders)" options={{headerShown: false}} />
            <Stack.Screen name="(statistics)" options={{headerShown: false}} />
            <Stack.Screen name="(profile)" options={{headerShown: false}} />
            <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        </Stack>      
    );

};