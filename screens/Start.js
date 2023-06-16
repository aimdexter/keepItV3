import { Button, Stack, TextInput } from "@react-native-material/core";
import * as LocalAuthentication from "expo-local-authentication";
import { signInWithEmailAndPassword } from "firebase/auth";
import { default as React, useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { auth } from "../firebase"; // Import the auth object from firebase

const Start = ({ navigation, router }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isBiometricSupported, setIsBiometricSupported] = React.useState(false);
  const [fingerprint, setFingerprint] = useState(false);

  const loginUser = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigation.navigate("Acceuil", {});
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          setError("Adresse email ou mot de passe invalide");
        } else if (error.code === "auth/wrong-password") {
          setError("Adresse email ou mot de passe invalide");
        } else if (error.code === "auth/email-already-in-use") {
          setError("Adresse email existe déjà utilisée");
        } else {
          setError("Erreur");
        }
      });
  };

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
      const enroll = await LocalAuthentication.isEnrolledAsync();
      if (enroll) {
        setFingerprint(true);
      }
    })();
  }, []);

  const handle = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Se connecter avec l'empreinte",
        disableDeviceFallback: true,
        cancelLabel: "Cancel",
      });
      if (biometricAuth.success) {
        navigation.navigate("Acceuil");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        padding: 30,
        justifyContent: "center",
      }}
    >
      <Image source={require("../assets/note-icon.png")} />
      <Text>KEEP-IT</Text>
      <Text>Concentrez-vous </Text>
      <Stack
        spacing={8}
        style={{
          margin: 16,
          width: "100%",
        }}
      >
        {error && <Text style={styles.error}>{error}</Text>}
        <TextInput
          label="Email"
          variant="outlined"
          value={email}
          onChangeText={setEmail}
          color="#7D91FA"
        />
        <TextInput
          label="Mot de passe"
          variant="outlined"
          color="#7D91FA"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
        <Button
          title="Se connecter"
          color="#7D91FA"
          onPress={loginUser}
          disabled={!email || !password}
        />
        {isBiometricSupported && fingerprint ? (
          <Button
            title="Se connecter avec l'empreinte"
            color="#7D91FA"
            onPress={handle}
          />
        ) : (
          <View>
            <Text>L'empreinte n'est pas supportée</Text>
          </View>
        )}
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text>Créer un compte</Text>
        </TouchableOpacity>
      </Stack>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    alignItems: "center",
    justifyContent: "center",
  },
  headingtext: {
    fontSize: 40,
  },
  start: {
    flex: 1,
    color: "black",
    backgroundColor: "#FFDFD3",
  },
  button: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 20,
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

export default Start;
