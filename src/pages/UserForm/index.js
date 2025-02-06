import { Button, Col, Form, Input, message, Radio, Row } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShowLoader } from "../../redux/loaderSlice";
import {
  AddUserData,
  CheckIfDetailsAlreadyFilled,
  UpdateUserData,
} from "../../apicalls/users";

function Patient() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [userform] = Form.useForm();
  const [alreadyFilled, setAlreadyFilled] = React.useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoader(true));
      const payload = {
        ...values,
        userId: user.id,
        details: "filled",
      };
      let response = null;
      if (alreadyFilled) {
        payload.id = user.id;
        response = await UpdateUserData(payload);
      } else {
        response = await AddUserData(payload);
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

  const checkIfDetailsFilled = async () => {
    try {
      dispatch(ShowLoader(true));
      const response = await CheckIfDetailsAlreadyFilled(
        user.id
      );
      if (response.success) {
        if (response.data.details === "filled") {
          setAlreadyFilled(true);
          userform.setFieldsValue(response.data);
        }
      }
      dispatch(ShowLoader(false));
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    checkIfDetailsFilled();
  }, []);

  return (
    <div>
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
      <div className="bg-white p-2">
      <h3 className="uppercase my-1">
        {alreadyFilled
          ? "Update Your Details "
          : "Please Fill Your Personnel Details "}
      </h3>
      <hr />
        <Form
          onFinish={onFinish}
          form={userform}
          layout="vertical"
          className="my-1"
       
        >
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
                label="Aadhar no"
                name="aadhar"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input type="number" placeholder="Enter your Aadhar number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Date of Birth"
                name="DOB"
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
            <Col span={8}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Required" }]}
              >
                <Radio.Group>
                  <Radio value={1}>Male</Radio>
                  <Radio value={2}>Female</Radio>
                  <Radio value={3}>Other</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            {/* add gender */}
            <Col span={8}>
              <Form.Item
                label="Pincode"
                name="pinCode"
                rules={[
                  { required: true, message: "Required" },
                  {
                    pattern: /^\d{6}$/,
                    message: "Enter a valid Pin Code",
                  },
                ]}
              >
                <Input type="number" placeholder="Enter the PINCODE" />
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
            {/* Guardian Details */}
            <Col span={24}>
              <h4 className="uppercase">
                <b>Guardian Details</b>
              </h4>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Guardian Name"
                name="gName"
                rules={[{ required: true, message: "required" }]}
              >
                <Input
                  type="text"
                  placeholder="Enter the Guardians Full name"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Guardian Contact"
                name="gPhone"
                rules={[
                  { required: true, message: "Required" },
                  {
                    pattern: /^\d{10,15}$/,
                    message: "Enter a valid phone number",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter your Guardians phone number"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Guardian Pincode"
                name="gPinCode"
                rules={[
                  { required: true, message: "Required" },
                  {
                    pattern: /^\d{6}$/,
                    message: "Enter a valid Pin Code",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter the Guardians PINCODE"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Guardians address"
                name="gAddress"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Enter the Guardians address"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <hr />
            </Col>
            {/* Work Hours */}
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
    </div>
  );
}

export default Patient;
