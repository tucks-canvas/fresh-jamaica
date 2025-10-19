import { Stack } from 'expo-router';

export default function AuthViews() {

    return (
        <Stack>
            <Stack.Screen name="farmer" options={{headerShown: false}} />
            <Stack.Screen name="customer" options={{headerShown: false}} />
            <Stack.Screen name="choice" options={{headerShown: false}} />
            <Stack.Screen name="signin" options={{headerShown: false}} />
            <Stack.Screen name="forgot" options={{headerShown: false}} />
            <Stack.Screen name="code" options={{headerShown: false}} />
            <Stack.Screen name="new" options={{headerShown: false}} />
        </Stack>      
    );

};