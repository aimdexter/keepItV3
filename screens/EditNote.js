import { Button, TextInput } from "@react-native-material/core";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { firestore } from "../firebase";

const EditNote = ({ route, navigation }) => {
  const [title, setTitle] = useState(route.params.titleNote);
  const [body, setNote] = useState(route.params.bodyNote);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, "note", route.params.noteId));
      navigation.navigate("Acceuil");
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    if (title !== "" && body !== "") {
      try {
        await updateDoc(doc(firestore, "note", route.params.noteId), {
          title: title,
          body: body,
        });
        navigation.navigate("Acceuil");
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please enter a note");
    }
  };

  return (
    <View>
      <View>
        <View
          style={{
            display: "flex",
            paddingVertical: 20,
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/note-icon.png")}
            style={{ width: 60, height: 60 }}
          />
          <Text style={{ fontWeight: "600" }}>Mes notes</Text>
        </View>
        <TextInput
          required
          label="Titre"
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
          color="#7D91FA"
        />
        <TextInput
          required
          label="Note"
          placeholder="note"
          value={body}
          onChangeText={(text) => setNote(text)}
          color="#7D91FA"
        />
        <View style={{}}>
          <Button
            title="Modifier Note"
            onPress={() => {
              handleUpdate();
            }}
            style={{
              fontWeight: "100",
              fontSize: 15,
              marginHorizontal: 60,
              marginVertical: 10,
              paddingHorizontal: 10,
              backgroundColor: "#7D91FA",
            }}
          />
          <Button
            title="Supprimer Note"
            onPress={() => {
              handleDelete();
            }}
            style={{
              fontWeight: "100",
              fontSize: 15,
              marginHorizontal: 60,
              paddingHorizontal: 10,
              backgroundColor: "#7D91FA",
              marginVertical: 10,
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  surface: {
    paddingHorizontal: 10,
    marginVertical: 10,
    height: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "left",
    display: "flex",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
  },
});

export default EditNote;
