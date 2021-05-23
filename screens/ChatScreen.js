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
    // This is the listener for authentication
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Chat");
      } else {
        navigation.navigate("Login");
      }
    });

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

    export function Example() {
        const [messages, setMessages] = useState([]);
      
        useEffect(() => {
          setMessages([
            {
              _id: 1,
              text: 'Hello developer',
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
              },
            },
          ])
        }, [])
      
        const onSend = useCallback((messages = []) => {
          setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        }, [])
      
        return (
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: 1,
            }}
          />
        )
      }












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

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => sendMessages(newMessages)}
      renderUsernameOnMessage={true}
      listViewProps={{
        style: {
          backgroundColor: "#666",
        },
      }}
      user={{
        _id: 1,
      }}
    />
  );
}
