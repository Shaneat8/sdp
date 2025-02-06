import CryptoJS from "crypto-js";
import firestoreDatabase from "../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { message } from "antd";

export const CreateUser = async (payload) => {
  try {
    const docRef = collection(firestoreDatabase, "users");
    const que = query(
      collection(firestoreDatabase, "users"),
      where("email", "==", payload.email)
    );
    const resQuery = await getDocs(que);
    if (resQuery.size > 0) {
      throw new Error("email already exists!!");
    }
    const encPass = CryptoJS.AES.encrypt(payload.password, "Bhalu").toString();
    payload.password = encPass;
    await addDoc(docRef, payload);
    return {
      success: true,
      message: "Users created successfully",
    };
  } catch (error) {
    return error;
  }
};

export const LoginUser = async (payload) => {
  try {
    const queLog = query(
      collection(firestoreDatabase, "users"),
      where("email", "==", payload.email)
    );
    const resLog = await getDocs(queLog);
    if (resLog.size === 0) {
      throw new Error("User does not exist...!");
    }
    const userDoc = resLog.docs[0];
    const user = userDoc.data();
    user.id = userDoc.id;
    const decPassbyte = CryptoJS.AES.decrypt(user.password, "Bhalu");
    const origPass = decPassbyte.toString(CryptoJS.enc.Utf8);
    if (origPass !== payload.password) {
      throw new Error("Password is incorrect");
    }
    return {
      success: true,
      message: "User Log In Success",
      data: user,
    };
  } catch (error) {
    return error;
  }
};

export const getAllUsers = async () => {
  try {
    const users = await getDocs(collection(firestoreDatabase, "users"));
    return {
      success: true,
      data: users.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getUserById = async (id) => {
  try {
    const user = await getDoc(doc(firestoreDatabase, "users", id));
    return {
      success: true,
      data: {
        ...user.data(),
        id: user.id,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const AddUserData = async (payload) => {
  try {
    await setDoc(
      doc(firestoreDatabase, "userDetails", payload.userId),
      payload
    );
    //adding details filled
    await updateDoc(doc(firestoreDatabase, "users", payload.userId), {
      detailsAdded: true,
    });
    return {
      success: true,
      message: "Users Details Added created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const UpdateUserData = async (payload) => {
  try {
    await setDoc(doc(firestoreDatabase, "userDetails", payload.id), payload);
    return {
      success: true,
      message: "User Data updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const CheckIfDetailsAlreadyFilled = async (id) => {
  try {
    const user = await getDocs(
      query(
        collection(firestoreDatabase, "userDetails"),
        where("userId", "==", id)
      )
    );

    if (user.size > 0) {
      return {
        success: true,
        message: "User has already filled details",
        data: user.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        })[0],
      };
    } else {
      return {
        success: false,
        message: "User Details not Filled",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const GetPatientDetails = async (patientId) => {
  try {
    const user = await getDocs(
      query(
        collection(firestoreDatabase, "userDetails"),
        where("userId", "==", patientId)
      )
    );
    if (user.size > 0) {
      return {
        success: true,
        message: "User details found",
        data: user.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))[0], // Fetch only the first matching record
      };
    } else {
      return {
        success: false,
        message: "User details not found",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const AddMedicineDiagnosis = async (payload) => {
  try {
    const prescriptionsRef = collection(firestoreDatabase, "prescriptions");
    await addDoc(prescriptionsRef, payload);
    return {
      success: true,
      message: "Prescription added successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
