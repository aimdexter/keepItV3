import { Stack, TextInput } from "@react-native-material/core";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, createUserWithEmailAndPassword } from "../firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Signup({ navigation, router }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const createAccount = async () => {
    try {
      if (password === confirmPassword) {
        await createUserWithEmailAndPassword(auth, email, password);
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('password', password)
        const value = await AsyncStorage.getItem('email')
+        navigation.navigate("Acceuil");
      } else {
        setError("Mots de passe ne sont pas identiques");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("L'adresse Email existe déjà");
      } else {
        setError("Ressayer");
      }
    }
  };

  return (
    <View
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={styles.header}>Créer un compte</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      <Stack
        spacing={3}
        style={{
          margin: 16,
          width: "100%",
          paddingVertical: 12,
          paddingHorizontal: 30,
        }}
      >
        <TextInput
          variant="outlined"
          value={email}
          label="Email"
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter email address"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          color="#7D91FA"
        />
        <TextInput
          variant="outlined"
          value={password}
          label="Mot de passe"
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Entrer le Mot de Passe"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          color="#7D91FA"
        />
        <TextInput
          variant="outlined"
          value={confirmPassword}
          label="Confirmer le Mot de Passe"
          color="#7D91FA"
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm password"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
        <Button
          title="Créer un compte"
          onPress={createAccount}
          disabled={!email || !password || !confirmPassword}
        />
      </Stack>
      <TouchableOpacity onPress={() => navigation.navigate("Start")}>
        <Text style={styles.link}>Se connecter à un compte existant</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  outer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    width: 240,
  },
  header: {
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 20,
  },
  link: {
    color: "blue",
    marginBottom: 20,
  },
  error: {
    marginBottom: 20,
    color: "red",
  },
});
