import { Stack } from 'expo-router';

export default function AdminViews() {

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        </Stack>      
    );

};