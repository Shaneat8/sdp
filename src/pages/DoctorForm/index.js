import { Col, Form, Row, Input, Button, message } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ShowLoader } from "../../redux/loaderSlice";
import {
  AddDoctor,
  checkIfDoctorAccountIsApplied,
  UpdateDoctor,
} from "../../apicalls/doctors";
import { useNavigate } from "react-router-dom";

function Doctor() {
  const [form] = Form.useForm();
  const [days, setDays] = React.useState([]);
  const [alreadyApplied, setAlreadyApplied] = React.useState(false);
  const [alreadyApproved, setAlreadyApproved] = React.useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoader(true));
      const payload = {
        ...values,
        days,
        userId: JSON.parse(localStorage.getItem("user")).id,
        status: "pending",
        role: "doctor",
      };
      let response = null;
      if (alreadyApproved) {
        payload.id = JSON.parse(localStorage.getItem("user")).id;
        payload.status = "approved";
        response = await UpdateDoctor(payload);
      } else {
        response = await AddDoctor(payload);
      }
      if (response.success) {
        message.success(response.message);
        nav("/profile");
      } else {
        message.error(response.message);
      }
      dispatch(ShowLoader(false));
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  const checkIfAlreadyApplied = async () => {
    try {
      dispatch(ShowLoader(true));
      const response = await checkIfDoctorAccountIsApplied(
        JSON.parse(localStorage.getItem("user")).id
      );
      if (response.success) {
        setAlreadyApplied(true);
        if (response.data.status === "approved") {
          setAlreadyApproved(true);
          form.setFieldsValue(response.data);
          setDays(response.data.days);
        }
      }
      dispatch(ShowLoader(false));
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    checkIfAlreadyApplied();
  }, []);

  if (alreadyApplied && !alreadyApproved) {
    return (
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-red">
          You have already applied for this doctor account, please wait for the
          admin to approve your request
        </h3>
      </div>
    );
  }

  return (
    <div className="bg-white p-2">
      <h3 className="uppercase my-1">
        {alreadyApproved
          ? "Update Your Details "
          : "Apply for a Doctor Account "}
      </h3>
      <hr />
      <Form layout="vertical" className="my-1" onFinish={onFinish} form={form}>
        <Row gutter={[16, 16]}>
          {/* Personal details */}
          <Col span={24}>
            <h4 className="uppercase">
              <b>Personal Details</b>
            </h4>
          </Col>
          <Col span={8}>
            <Form.Item
              label="First Name"
              name="FirstName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input type="text" placeholder="Enter your first name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Last Name"
              name="LastName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input type="text" placeholder="Enter your last name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input type="email" placeholder="Enter your email" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Registration No"
              name="degree"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                type="number"
                placeholder="Enter your registration number"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Validity Up To"
              name="validity"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input type="date" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: "Required" },
                {
                  pattern: /^\d{10,15}$/,
                  message: "Enter a valid phone number",
                },
              ]}
            >
              <Input type="number" placeholder="Enter your phone number" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input.TextArea rows={3} placeholder="Enter your address" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <hr />
          </Col>
          {/* Professional Details */}
          <Col span={24}>
            <h4 className="uppercase">
              <b>Professional Details</b>
            </h4>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Speciality"
              name="speciality"
              rules={[{ required: true, message: "required" }]}
            >
              <select>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Cardiologists">Cardiologists</option>
                <option value="Gastroenterologists">Gastroenterologists</option>
                <option value="Neurologists">Neurologists</option>
                <option value="Gynecologists">Gynecologists</option>
                <option value="Oncologists">Oncologists</option>
                <option value="Ophthalmologists">Ophthalmologists</option>
                <option value="Pathologists">Pathologists</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Physiatrists">Physiatrists</option>
              </select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Experience"
              name="experience"
              rules={[{ required: true, message: "required" }]}
            >
              <Input
                type="number"
                placeholder="Enter your experience in years"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Qualification"
              name="qualification"
              rules={[{ required: true, message: "required" }]}
            >
              <select>
                <option value="MBBS">MBBS</option>
                <option value="MD">MD</option>
                <option value="MDS">MDS</option>
                <option value="BAMS">BAMS</option>
                <option value="BUMS">BUMS</option>
                <option value="BSMS">BSMS</option>
                <option value="BHMS">BHMS</option>
              </select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <hr />
          </Col>
          {/* Work Hours */}
          <Col span={24}>
            <h4 className="uppercase">
              <b>Work Hours</b>
            </h4>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Start Time"
              name="startTime"
              rules={[{ required: true, message: "required" }]}
            >
              <Input type="time" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="End Time"
              name="endTime"
              rules={[{ required: true, message: "required" }]}
            >
              <Input type="time" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <div className="flex gap-2">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day, index) => (
                <div className="flex items-center" key={index}>
                  <input
                    type="checkbox"
                    checked={days.includes(day)}
                    value={day}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDays([...days, e.target.value]);
                      } else {
                        setDays(days.filter((item) => item !== e.target.value));
                      }
                    }}
                  />
                  <label>{day}</label>
                </div>
              ))}
            </div>
          </Col>
        </Row>
        <div className="flex justify-end gap-2">
          <Button className="outlined-btn" type="button">
            CANCEL
          </Button>
          <Button className="contained-btn" type="primary" htmlType="submit">
            SUBMIT
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Doctor;
