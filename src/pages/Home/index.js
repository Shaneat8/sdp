import { Button, Col, message, Row } from "antd";
import { Input } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShowLoader } from "../../redux/loaderSlice";
import { getAllDoctor } from "../../apicalls/doctors";
const { Search } = Input;

function Home() {
  const nav = useNavigate();
  const [doctors, setDoctors] = React.useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(ShowLoader(true));
      const response = await getAllDoctor();
      if (response.success) {
        // Only show approved doctors
        const approvedDoctors = response.data.filter(
          (doctor) => doctor.status === "approved"
        );
        setDoctors(approvedDoctors);
      } else {
        message.error(response.message);
      }
      dispatch(ShowLoader(false));
    } catch (error) {
      message.error(error.message);
      dispatch(ShowLoader(false));
    }
  };
  
  useEffect(() => {
    getData();
  }, []);
  return (
    user && <div>
      <div className="flex justify-between">
        <div className="flex ">
          <Search placeholder="Search Doctor" allowClear />
        </div>
        {user?.role === "user" && (
          <Button
            type="default"
            onClick={() => {
              nav("/apply-doc");
            }}
          >
            Apply Doctor
          </Button>
        )}
      </div>
      <Row gutter={[16, 16]} className="my-1">
        {doctors.map((doctor) => {
          return (
            <Col span={8} key={doctor.id}>
              <div
                className="bg-white p-1 flex flex-column gap-1 cursor-pointer"
                onClick={() => {
                  nav(`/book-appointment/${doctor.id}`);
                }}
              >
                <div className="flex justify-between">
                  <h2>
                    Dr.{" "}
                    <span className="uppercase">
                      {doctor.FirstName} {doctor.LastName}{" "}
                    </span>
                  </h2>
                </div>
                <hr />
                <div className="flex justify-between w-full">
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
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default Home;
