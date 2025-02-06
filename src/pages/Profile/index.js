import { Tabs } from "antd";
import React from "react";
import Appointment from "./Appointment";
import Doctor from "../DoctorForm";
import moment from "moment";
import UserForm from "../UserForm";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const items = [
    {
      key: "1",
      label: "Appointments", // What to show on the tab
      children: <Appointment />, // Content for this tab
    },
    {
      key: "2",
      label: "Profile",
      children: (
        <div >
          {/* {user.role === "doctor" && <Doctor/>} */}
          {user.role === "doctor" && <Doctor />}
          {user.role === "user" && <UserForm />}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* 
      old way new way uses item
      <Tabs>
        <Tabs.TabPane tab="Appointments" key="1">
          <Appointment />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Profile" key="2"></Tabs.TabPane>
      </Tabs> */}

      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}

export default Profile;
