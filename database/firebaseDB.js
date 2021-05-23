import firebase from 'firebase/app';
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCEu4C-63CxrIt9rP9MP9a7hmp55-B8Kw0",
    authDomain: "pcmob4-projectchatapp.firebaseapp.com",
    projectId: "pcmob4-projectchatapp",
    storageBucket: "pcmob4-projectchatapp.appspot.com",
    messagingSenderId: "874725105004",
    appId: "1:874725105004:web:210e42c847c9c9fcbb2749"
};

firebase.initializeApp(firebaseConfig);
export default firebase;