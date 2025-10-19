import { Stack } from 'expo-router';

export default function Customers_Orders() {

    return (
        <Stack>
            <Stack.Screen name="track" options={{headerShown: false}} />
            <Stack.Screen name="timeline" options={{headerShown: false}} />
        </Stack>      
    );

};


