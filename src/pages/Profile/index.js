import { Tabs } from "antd";
import React from "react";
import Appointment from "./Appointment";
import Doctor from "../DoctorForm";
import moment from "moment";

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
        <div>
          {/* {user.role === "doctor" && <Doctor/>} */}
          {user.role === "doctor" && <Doctor />}
          {user.role === "user" && (
            <div className="flex flex-column my-1 p-1 bg-white gap-1">
              <div className="flex gap-2">
                <h4>
                  <b>Name : {user.name}</b>
                </h4>
              </div>
              <div className="flex gap-2">
                <h4>
                  <b>Email : {user.email}</b>
                </h4>
              </div>
              <div className="flex gap-2">
                <h4>
                  <b>
                    Created On :{" "}
                    {moment(user?.createdAt).format("DD-MM-YYYY hh:mm A")}
                  </b>
                </h4>
              </div>
            </div>
          )}
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
