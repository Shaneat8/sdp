import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ShowLoader } from "../../redux/loaderSlice";
import { message } from "antd";
import { GetDoctorById } from "../../apicalls/doctors";
import moment from "moment";
import {
  BookDoctorAppointment,
  GetDoctorAppointmentOnDate,
} from "../../apicalls/appointments";

function BookAppointment() {
  const [doctor, setDoctor] = React.useState(null);
  const [date, setDate] = React.useState("");
  const [bookedSlots, setBookedSlots] = React.useState([]);
  const [selectedSlot, setSelectedSlot] = React.useState("");
  const [problem, setProblem] = React.useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const getSlotsData = () => {
    const day = moment(date).format("dddd");
    if (!doctor.days.includes(day)) {
      return <h3>Doctor not available on {moment().format("DD-MM-YYYY")}</h3>;
    }
    let startTime = moment(doctor.startTime, "HH:mm");
    let endTime = moment(doctor.endTime, "HH:mm");
    let slotDuration = 60; //in minutes
    const slots = [];
    while (startTime < endTime) {
      // if (
      //   !bookedSlots?.find((slot) => slot.slot === startTime.format("HH:mm"))
      // ) {
      // }
      slots.push(startTime.format("HH:mm"));
      startTime.add(slotDuration, "minutes");
    }
    return slots.map((slot) => {
      const isBooked = bookedSlots?.find(
        (bookedSlots) => bookedSlots.slot === slot && bookedSlots.status !== 'Cancelled'
      );
      return (
        <div
          className="bg-white p-1 cursor-pointer"
          key={slot}
          onClick={() => {
            setSelectedSlot(slot);
            console.log("Selected Slot:", slot);
          }}
          style={{
            border:
              selectedSlot === slot ? "3px solid green" : "1px solid gray",
            backgroundColor: isBooked ? "gray" : "white",
            pointerEvents: isBooked ? "none" : "auto",
            cursor: isBooked ? "not-allowed" : "pointer",
          }}
        >
          <span>
            {moment(slot, "HH:mm").format("hh:mm A")} -{" "}
            {moment(slot, "HH:mm")
              .add(slotDuration, "minutes")
              .format("hh:mm A")}
          </span>
        </div>
      );
    });
  };
  const getData = async () => {
    try {
      dispatch(ShowLoader(true));
      const response = await GetDoctorById(id);
      if (response.success) {
        setDoctor(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(ShowLoader(false));
    } catch (error) {
      message.error(error.message);
      dispatch(ShowLoader(false));
    }
  };
  const onBookAppointment = async () => {
    try {
      dispatch(ShowLoader(true));
      const payload = {
        doctorId: doctor.id,
        userId: JSON.parse(localStorage.getItem("user")).id,
        date,
        slot: selectedSlot,
        doctorName: `${doctor.FirstName} ${doctor.LastName}`,
        userName: JSON.parse(localStorage.getItem("user")).name,
        bookedOn: moment().format("DD-MM-YYYY hh:mm A"),
        problem,
        status: "pending",
      };
      const response = await BookDoctorAppointment(payload);
      if (response.success) {
        message.success(response.message);
        nav("/profile");
      } else {
        message.error(response.message);
      }
      dispatch(ShowLoader(false));
    } catch (error) {
      message.error(error.message);
      dispatch(ShowLoader(false));
    }
  };
  const getBookedSlots = async () => {
    try {
      dispatch(ShowLoader(true));
      const response = await GetDoctorAppointmentOnDate(id, date);
      dispatch(ShowLoader(false));
      if (response.success) {
        console.log(response.data);
        setBookedSlots(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    getData();
  }, [id]);

  useEffect(() => {
    if (date) {
      getBookedSlots();
    }
  }, [date]);
  return (
    doctor && (
      <div className="bg-white p-2 ">
        <h1 className="uppercase my-1">
          <b>
            {doctor?.FirstName} {doctor?.LastName}{" "}
          </b>
        </h1>
        <hr />
        <div className="w-half flex flex-justify flex-column my-1 gap-1">
          <div className="flex justify-between w-full ">
            <h4>Speciality :</h4>
            <h4>{doctor.speciality}</h4>
          </div>
          <div className="flex justify-between w-full">
            <h4>Experience :</h4>
            <h4>{doctor.experience} Years</h4>
          </div>
          <div className="flex justify-between w-full">
            <h4>Est Queue Time :</h4>
            <h4>Work in Progress</h4>
          </div>
          <div className="flex justify-between w-full">
            <h4>Email :</h4>
            <h4>{doctor.email}</h4>
          </div>
          <div className="flex justify-between w-full">
            <h4>Phone :</h4>
            <h4>{doctor.phone}</h4>
          </div>
          <div className="flex justify-between w-full">
            <h4>Days Available :</h4>
            <h4>{doctor.days.join(",")}</h4>
          </div>
        </div>
        <hr />
        {/* Slots here */}
        <div className="flex flex-column gap-1 my-2">
          <div className="flex gap-2 w-400 items-end">
            <div>
              <span>Select Date :</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={moment().format("YYYY-MM-DD")}
              />
            </div>
          </div>
          <div className="flex gap-2">{date && getSlotsData()}</div>
          {selectedSlot && (
            <div className="flex flex-column">
              <textarea
                placeholder="Enter Your problem here"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              ></textarea>
              <div className="my-3 flex gap-2 justify-center items-center w-400 ">
                <button
                  className="outlined-button"
                  onClick={() => {
                    nav("/");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="contained-button "
                  onClick={onBookAppointment}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default BookAppointment;
