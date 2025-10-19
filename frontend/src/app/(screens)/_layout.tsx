import { Stack } from 'expo-router';

export default function Views() {

    return (
        <>
            <Stack>
                <Stack.Screen name="(auth)" options={{headerShown: false}} />
                <Stack.Screen name="(load)" options={{headerShown: false}} />
                <Stack.Screen name="(farmers)" options={{headerShown: false}} />
                <Stack.Screen name="(customers)" options={{headerShown: false}} />
                <Stack.Screen name="(admin)" options={{headerShown: false}} />
                <Stack.Screen name="(delivery)" options={{headerShown: false}} />
            </Stack>    
        </>  
    );

};