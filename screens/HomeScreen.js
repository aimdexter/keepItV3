import { Button } from "@react-native-material/core";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CreateNote from "../components/CreateNote";
import { auth, firestore } from "../firebase";

const HomeScreen = ({ route, navigation }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [singlenote, setSinglenote] = useState({});

  const userID = auth.currentUser.uid;
  const collectionRef = collection(firestore, "note");
  const userNotesQuery = query(collectionRef, where("userId", "==", userID));

  const logout = async () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("Start");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(userNotesQuery, (querySnapshot) => {
      const newNotes = [];
      querySnapshot.forEach((doc) => {
        const { body, title, userId } = doc.data();
        newNotes.push({ body, title, userId, id: doc.id });
      });
      setIsLoading(false);
      setNotes(newNotes);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View>
      {isLoading ? (
        <View
          style={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "auto",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View>
          <View
            style={{
              display: "flex",
              paddingVertical: 20,
              marginHorizontal: 100,
              alignItems: "center",
            }}
          >
            <Image
              source={require("../assets/note-icon.png")}
              style={{ width: 60, height: 60 }}
            />
            <Text style={{ fontWeight: "400", fontSize: 15 }}>Mes notes</Text>
          </View>
          <View>
            {notes.map(({ body, title, userId, id }, i) => {
              return (
                <TouchableOpacity
                  style={[styles.surface]}
                  onPress={() => {
                    setSinglenote(notes[i]);
                    navigation.navigate("EditNote", {
                      titleNote: notes[i].title,
                      bodyNote: notes[i].body,
                      noteId: notes[i].id,
                    });
                  }}
                  key={i}
                >
                  <View
                    style={{
                      display: "flex",
                      gap: 3,
                      width: 500,
                      height: "100%",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 18,
                        marginHorizontal: 70,
                      }}
                    >
                      {title}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "200",
                        fontSize: 15,
                        marginHorizontal: 60,
                        paddingHorizontal: 10,
                      }}
                    >
                      {body}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            <CreateNote />
            <Button
              title="Déconnexion"
              onPress={() => {
                logout();
              }}
              style={{
                fontWeight: "100",
                fontSize: 15,
                marginHorizontal: 60,
                paddingHorizontal: 10,
                backgroundColor: "#7D91FA",
              }}
            />
          </View>
        </View>
      )}
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

export default HomeScreen;