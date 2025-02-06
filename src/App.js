import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Spinner from "./components/Spinner";
import { useSelector } from "react-redux";
import Doctor from "./pages/DoctorForm";
import Admin from "./pages/Admin";
import BookAppointment from "./pages/BookAppointment";
import UserForm from "./pages/UserForm";
import Patient from "./pages/DoctorForm/patient";
function App() {
  const {loading} = useSelector(state=>state.loader);
  return (
    <div >
      {loading && <Spinner/>}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
          <Route path="/book-appointment/:id" element={<ProtectedRoute><BookAppointment/></ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
          <Route path="/apply-doc" element={<ProtectedRoute><Doctor/></ProtectedRoute>}/>
          <Route path="/user-details" element={<ProtectedRoute><UserForm/></ProtectedRoute>}/>
          <Route path="/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>}/>
          <Route path="/patient/:patientId" element={<ProtectedRoute><Patient/></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
