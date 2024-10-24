import { Form, Input, message } from "antd";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { ShowLoader } from "../../redux/loaderSlice";

function Login() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    // console.log(values);
    try {
      dispatch(ShowLoader(true));
      const response = await LoginUser(values);
      dispatch(ShowLoader(false));
      if (response.success) {
        message.success(response.message);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...response.data,
            password: "",
          })
        );
        nav("/");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      nav("/");
    }
  }, [nav]);
  return (
    <div className="flex justify-center items-center h-screen">
      <Form
        layout="vertical"
        className="w-400 bg-white p-2"
        onFinish={onFinish}
      >
        <h2 className="uppercase my-1">
          <strong>SwasthyaSEVA Login</strong>
        </h2>
        <hr /><br/>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter a valid email" }]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter a password" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <button className="contained-button my-1 " type="submit">
          Login
        </button>
        <Link className="underline" to="/register">
          Don't have an account ? <strong>Register Now</strong>
        </Link>
      </Form>
    </div>
  );
}

export default Login;
