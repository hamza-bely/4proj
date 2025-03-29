import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from 'expo-router';
import { supabase } from "@/app/core/services/supabase";

export default function LoadingScreen() {

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if(!user){
                router.push('/presentation/auth')
            }
            router.push('/presentation/home')
        };
        checkUser();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3498db" />
        </View>
    );
}
