import { message, Table } from "antd";
import React, { useEffect } from "react";
import {
  GetDoctorAppointments,
  GetUserAppointments,
  UpdateAppointment,
} from "../../apicalls/appointments";
import { useDispatch } from "react-redux";
import { ShowLoader } from "../../redux/loaderSlice";
import { useNavigate } from "react-router-dom";

function Appointment() {
  const [appointments, setAppointments] = React.useState([]);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const getData = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    let response;
    if (user.role === "doctor") {
      response = await GetDoctorAppointments(user.id);
    } else {
      response = await GetUserAppointments(user.id);
    }

    if (response.success) {
      setAppointments(response.data);
    } else {
      console.error(response.message); // Log error if fetching fails
    }
  };
  const onUpdate = async (id, status) => {
    try {
      dispatch(ShowLoader(true));
      const response = await UpdateAppointment(id, status);
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message); // Corrected here
      }
      dispatch(ShowLoader(false));
    } catch (error) {
      message.error(error.message); // Corrected here
      dispatch(ShowLoader(false));
    }
  };

  const handleViewUser = (record) => {
    // Navigate to user details page with appointment ID
    nav(`/patient/${record.userId}`, {
      state: {
        appointmentId: record.id,
        appointmentDetails: record,
      },
    });
  };
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Time",
      dataIndex: "slot",
    },
    {
      title: "Doctor",
      dataIndex: "doctorName",
    },
    {
      title: "Patient",
      dataIndex: "userName",
    },
    {
      title: "Booked on",
      dataIndex: "bookedOn",
    },
    {
      title: "Problem",
      dataIndex: "problem",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (record.status === "pending" && user.role === "doctor") {
          return (
            <div className="flex gap-1">
              <span
                className="underline cursor-pointer"
                onClick={() => onUpdate(record.id, "cancelled")}
              >
                Cancel
              </span>
              <span
                className="underline cursor-pointer"
                onClick={() => onUpdate(record.id, "approved")}
              >
                Approve
              </span>
            </div>
          );
        }
        if (record.status === "approved" && user.role === "doctor") {
          return (
            <div className="flex gap-1">
              <span
                className="underline cursor-pointer"
                onClick={() => handleViewUser(record)}
              >
                View
              </span>
            </div>
          );
        }
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={appointments} // Directly use appointments array
        rowKey="id" // Assuming each appointment has a unique ID
      />
    </div>
  );
}

export default Appointment;
