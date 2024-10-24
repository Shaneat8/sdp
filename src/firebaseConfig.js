import { initializeApp  } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDF3FSGFCJdcB02Ng-kbqlDLkMErCxw1vY",
  authDomain: "ss-demo-1dc4e.firebaseapp.com",
  projectId: "ss-demo-1dc4e",
  storageBucket: "ss-demo-1dc4e.appspot.com",
  messagingSenderId: "394159920360",
  appId: "1:394159920360:web:53db73ade24e5777b9e55d",
  measurementId: "G-GHT8J2HYLY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestoreDatabase = getFirestore(app);
export default firestoreDatabase;