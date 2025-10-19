import { Stack } from 'expo-router';

export default function Farmers_ProductsViews() {

    return (
        <Stack>
            <Stack.Screen name="add-product" options={{headerShown: false}} />
            <Stack.Screen name="edit-product" options={{headerShown: false}} />
            <Stack.Screen name="product" options={{headerShown: false}} />
        </Stack>      
    );

};