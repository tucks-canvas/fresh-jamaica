import { Stack } from 'expo-router';

export default function LoadViews() {

    return (
        <Stack>
            <Stack.Screen name="reel" options={{headerShown: false}} />
            <Stack.Screen name="loading" options={{headerShown: false}} />
        </Stack>      
    );
};