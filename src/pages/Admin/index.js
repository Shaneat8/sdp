import React, { useEffect } from "react";
import { message, Tabs } from "antd";
import UsersList from "./UsersList";
import DoctorsList from "./DoctorsList";
import { useDispatch } from "react-redux";
import { ShowLoader } from "../../redux/loaderSlice";
import { getUserById } from "../../apicalls/users";
import Medicine from "./Medicine";

function Admin() {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const checkIsAdmin = async () => {
    try {
      dispatch(ShowLoader(true));
      const response = await getUserById(user.id);
      dispatch(ShowLoader(false));
      if (response.success && response.data.role === "admin") {
        setIsAdmin(true);
      } else {
        throw new Error("You are not an admin");
      }
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    checkIsAdmin();
  }, []);

  return (
    isAdmin && (
      <div className="bg-white p-1">
        <Tabs>
          <Tabs.TabPane tab="Users" key="1">
            <UsersList />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Doctors" key="2">
            <DoctorsList />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Medicine" key="3">
            <Medicine/>
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  );
}

export default Admin;
