import { Stack } from 'expo-router';

export default function Customers_ProfileViews() {

    return (
        <Stack>
            <Stack.Screen name="editprofile" options={{headerShown: false}} />
            <Stack.Screen name="address" options={{headerShown: false}} />
            <Stack.Screen name="editaddress" options={{headerShown: false}} />
            <Stack.Screen name="payment" options={{headerShown: false}} />
            <Stack.Screen name="editpayment" options={{headerShown: false}} />
            <Stack.Screen name="notifications" options={{headerShown: false}} />
            <Stack.Screen name="settings" options={{headerShown: false}} />
        </Stack>      
    );
};