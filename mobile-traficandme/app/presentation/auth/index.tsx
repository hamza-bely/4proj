import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { supabase } from "@core/services/supabase";
import { useRouter } from "expo-router";

export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) router.replace("/presentation/home");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Se connecter" onPress={signIn} />
    </View>
  );
}
