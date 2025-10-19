import { Stack } from 'expo-router';

export default function Customers_HomeViews() {

    return (
        <Stack>
            <Stack.Screen name="product" options={{headerShown: false}} />
        </Stack>      
    );

};