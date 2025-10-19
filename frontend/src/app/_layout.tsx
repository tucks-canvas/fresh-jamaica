import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { useFonts } from 'expo-font';
import { useEffect } from 'react';

import { AuthProvider } from '@/contexts/AuthContext';
import { ProductsProvider } from '@/contexts/ProductsContext';

SplashScreen.preventAutoHideAsync();

export default function Root() {

    const [loaded, error] = useFonts({
        // Afacad Flux

        "AfacadFlux-Black": require("../assets/fonts/AfacadFlux-Black.ttf"),
        "AfacadFlux-Bold": require("../assets/fonts/AfacadFlux-Bold.ttf"),
        "AfacadFlux-Medium": require("../assets/fonts/AfacadFlux-Medium.ttf"),
        "AfacadFlux-Regular": require("../assets/fonts/AfacadFlux-Regular.ttf"),
        "AfacadFlux-Thin": require("../assets/fonts/AfacadFlux-Thin.ttf"),
        "AfacadFlux-SemiBold": require("../assets/fonts/AfacadFlux-SemiBold.ttf"),
        "AfacadFlux-ExtraBold": require("../assets/fonts/AfacadFlux-ExtraBold.ttf"),
        "AfacadFlux-ExtraLight": require("../assets/fonts/AfacadFlux-ExtraLight.ttf"),
        "AfacadFlux-Light": require("../assets/fonts/AfacadFlux-Light.ttf"),
        
        // Monsterrat
        
        "Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
        "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
        "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
        "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Thin": require("../assets/fonts/Montserrat-Thin.ttf"),
        "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
        "Montserrat-ExtraBold": require("../assets/fonts/Montserrat-ExtraBold.ttf"),
        "Montserrat-ExtraLight": require("../assets/fonts/Montserrat-ExtraLight.ttf"),
        "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),

        // Nunito

        "Nunito-Black": require("../assets/fonts/Nunito-Black.ttf"),
        "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
        "Nunito-Medium": require("../assets/fonts/Nunito-Medium.ttf"),
        "Nunito-Regular": require("../assets/fonts/Nunito-Regular.ttf"),
        "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
        "Nunito-ExtraBold": require("../assets/fonts/Nunito-ExtraBold.ttf"),
        "Nunito-ExtraLight": require("../assets/fonts/Nunito-ExtraLight.ttf"),
        "Nunito-Light": require("../assets/fonts/Nunito-Light.ttf"),

        // Funnel-Display

        "FunnelDisplay-Bold": require("../assets/fonts/FunnelDisplay-Bold.ttf"),
        "FunnelDisplay-Medium": require("../assets/fonts/FunnelDisplay-Medium.ttf"),
        "FunnelDisplay-Regular": require("../assets/fonts/FunnelDisplay-Regular.ttf"),
        "FunnelDisplay-SemiBold": require("../assets/fonts/FunnelDisplay-SemiBold.ttf"),
        "FunnelDisplay-ExtraBold": require("../assets/fonts/FunnelDisplay-ExtraBold.ttf"),
        "FunnelDisplay-Light": require("../assets/fonts/FunnelDisplay-Light.ttf"),

        // Poppins

        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),

        // Lightbox21

        "Lightbox21-ExtraBold": require("../assets/fonts/Lightbox21-ExtraBold.ttf"),
        "Lightbox21-Bold": require("../assets/fonts/Lightbox21-Bold.ttf"),
        "Lightbox21-Medium": require("../assets/fonts/Lightbox21-Medium.ttf"),
        "Lightbox21-Thin": require("../assets/fonts/Lightbox21-Thin.ttf"),
        "Lightbox21-Regular": require("../assets/fonts/Lightbox21-Regular.ttf"),
        "Lightbox21-UltraLight": require("../assets/fonts/Lightbox21-UltraLight.ttf"),
        "Lightbox21-Light": require("../assets/fonts/Lightbox21-Light.ttf"),
        "Lightbox21-Black": require("../assets/fonts/Lightbox21-Black.ttf"),

        // Gilroy

        "Gilroy-ExtraBold": require("../assets/fonts/Gilroy-ExtraBold.ttf"),
        "Gilroy-Bold": require("../assets/fonts/Gilroy-Bold.ttf"),
        "Gilroy-Medium": require("../assets/fonts/Gilroy-Medium.ttf"),
        "Gilroy-Thin": require("../assets/fonts/Gilroy-Thin.ttf"),
        "Gilroy-Regular": require("../assets/fonts/Gilroy-Regular.ttf"),
        "Gilroy-UltraLight": require("../assets/fonts/Gilroy-UltraLight.ttf"),
        "Gilroy-Light": require("../assets/fonts/Gilroy-Light.ttf"),
        "Gilroy-Black": require("../assets/fonts/Gilroy-Black.ttf"),
        "Gilroy-SemiBold": require("../assets/fonts/Gilroy-SemiBold.ttf"),
        "Gilroy-SemiBoldItalic": require("../assets/fonts/Gilroy-SemiBoldItalic.ttf"),
        "Gilroy-ExtraBoldItalic": require("../assets/fonts/Gilroy-ExtraBoldItalic.ttf"),
        "Gilroy-BoldItalic": require("../assets/fonts/Gilroy-BoldItalic.ttf"),
        "Gilroy-MediumItalic": require("../assets/fonts/Gilroy-MediumItalic.ttf"),
        "Gilroy-ThinItalic": require("../assets/fonts/Gilroy-ThinItalic.ttf"),
        "Gilroy-RegularItalic": require("../assets/fonts/Gilroy-RegularItalic.ttf"),
        "Gilroy-UltraLightItalic": require("../assets/fonts/Gilroy-UltraLightItalic.ttf"),
        "Gilroy-LightItalic": require("../assets/fonts/Gilroy-LightItalic.ttf"),
        "Gilroy-BlackItalic": require("../assets/fonts/Gilroy-BlackItalic.ttf"),
    });

    useEffect(() => {
        if (error) throw error;
        if (loaded) SplashScreen.hideAsync();
    }, [loaded, error]);

    if (!loaded && !error) return null;

    return (
        <>
            <AuthProvider>
                <ProductsProvider>
                    <Stack>
                        <Stack.Screen name="index" options={{headerShown: false}} />
                        <Stack.Screen name="(screens)" options={{headerShown: false}} />
                    </Stack> 
                </ProductsProvider>
            </AuthProvider> 
        </>    
    );

};