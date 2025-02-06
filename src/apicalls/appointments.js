import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import firestoreDatabase from "../firebaseConfig";

export const BookDoctorAppointment = async (payload) => {
  try {
    // Fetch user details based on email (or user ID if preferred)
    const userQuery = query(
      collection(firestoreDatabase, "users"), // Ensure you are querying the right collection
      where("__name__", "==", payload.userId) // Match based on email (or user ID)
    );

    const userSnapshot = await getDocs(userQuery);

    // Debug log to check if the user query returns data
    console.log("User snapshot:", userSnapshot);

    if (userSnapshot.empty) {
      return {
        success: false,
        message: "User not found",
      };
    }

    let userDetails = {};
    userSnapshot.forEach((doc) => {
      userDetails = doc.data();
      console.log("User details found:", userDetails); // Debug log user details
    });

    // Check if detailsAdded is true
    if (userDetails.detailsAdded !== true) {
      console.log("User detailsAdded is false or undefined"); // Debug log for failure condition
      return {
        success: false,
        message: "User details not completed. Please update your profile.",
      };
    }

    // Proceed with booking the appointment if detailsAdded is true
    await addDoc(collection(firestoreDatabase, "appointments"), payload);
    return {
      success: true,
      message: "Appointment Booked Successfully",
    };
  } catch (error) {
    console.error("Error occurred during booking:", error); // Debug log for any errors
    return {
      success: false,
      message: error.message,
    };
  }
};

export const GetDoctorAppointmentOnDate = async (doctorId, date) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(firestoreDatabase, "appointments"),
        where("doctorId", "==", doctorId),
        where("date", "==", date)
      )
    );
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// API Calls
export const GetDoctorAppointments = async (doctorId) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(firestoreDatabase, "appointments"),
        where("doctorId", "==", doctorId) // Fix here
      )
    );
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() }); // Include document ID for key
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const GetUserAppointments = async (userId) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(firestoreDatabase, "appointments"),
        where("userId", "==", userId) // Fix here
      )
    );
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() }); // Include document ID for key
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const UpdateAppointment = async (id, status) => {
  try {
    await updateDoc(doc(firestoreDatabase, "appointments", id), {
      status,
    });
    return {
      success: true,
      message: "Appointment Status updated",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
