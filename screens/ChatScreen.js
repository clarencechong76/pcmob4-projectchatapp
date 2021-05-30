import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import firebase from "../database/firebaseDB";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GiftedChat } from "react-native-gifted-chat";
const db = firebase.firestore().collection("messages");
const auth = firebase.auth();
export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
   
    // This sets up the top right button
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout}>
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color="black"
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
      ),
    });
    // This loads data from firebase
    const unsubscribeSnapshot = db
      .orderBy("createdAt", "desc")
      .onSnapshot((collectionSnapshot) => {
        const serverMessages = collectionSnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(data);
          const returnData = {
            ...doc.data(),
            createdAt: new Date(data.createdAt.seconds * 1000), // convert to JS date object
          };
          return returnData;
        });
        setMessages(serverMessages);
      });
       // This is the listener for authentication
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
        if (user) {
          navigation.navigate("Chat");
        } else {
          navigation.navigate("Login");
        }
      });
      
    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);
  function logout() {
    auth.signOut();
  }
  function sendMessages(newMessages) {
    console.log(newMessages);
    const newMessage = newMessages[0];
    db.add(newMessage);
    //setMessages([...newMessages, ...messages]);
  }
if (firebase.auth().currentUser) {
  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => sendMessages(newMessages)}
      user={{
        _id: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.email,
        }}
    />
  );
    } else {
      return null;
    }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffc",
    alignItems: "center",
    justifyContent: "center",
  },
});




