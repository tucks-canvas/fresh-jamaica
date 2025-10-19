import { Stack } from 'expo-router';

export default function Customers_CartViews() {

    return (
        <Stack>
            <Stack.Screen name="checkout" options={{headerShown: false}} />
            <Stack.Screen name="paymentsuccess" options={{headerShown: false}} />
        </Stack>      
    );

};