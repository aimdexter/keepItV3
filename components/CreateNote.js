import { TextInput } from "@react-native-material/core";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { auth, firestore } from "../firebase";

import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [body, setNote] = useState("");
  const userId = auth.currentUser.uid;
  const handleAdd = async () => {
    if (title != "" && body != "") {
      try {
        const docRef = await addDoc(collection(firestore, "note"), {
          title,
          body,
          userId,
        });
        setTitle("");
        setNote("");
        Keyboard.dismiss();
      } catch (error) {
        alert(error);
      }
    } else {
      alert("Veuillez entrer une note");
    }
  };
  return (
    <View>
      <TextInput
        required
        label="Titre"
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
        color="#7D91FA"
      />
      <TextInput
        required
        label="Note"
        style={styles.input}
        placeholder="note"
        value={body}
        onChangeText={(text) => setNote(text)}
        color="#7D91FA"
      />
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Créer une note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    fontWeight: "100",
    fontSize: 15,
    marginHorizontal: 60,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#7D91FA",
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
