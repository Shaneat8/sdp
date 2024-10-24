import { Input, Form, message } from "antd";
import { CreateUser } from "../../apicalls/users";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {ShowLoader} from "../../redux/loaderSlice";

function Register() {
  const nav =useNavigate();
  const dispatch=useDispatch();
  const onFinish = async (values) => {
    // console.log(values);
    try {
      dispatch(ShowLoader(true));
      const response = await CreateUser({
        ...values,
        role:"user",
      });
      dispatch(ShowLoader(false))
      if (response.success) {
        message.success(response.message);
        nav('/login');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }

  };

  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('user'));
    if(user){
      nav('/');
    }
  },[nav])
  return (
    <div className="flex justify-center items-center h-screen">
      <Form
        layout="vertical"
        className="w-400 bg-white p-2"
        onFinish={onFinish}
      >
        <h2 className="uppercase my-1">
          <strong>SwasthyaSEVA Register</strong>
        </h2>

        <hr />
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Pls enter name!" }]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item label="Email" name="email"
        rules={[{required:true,message:"Please enter a valid email"}]}>
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          
          rules={[{ required: true, message: "Pls enter password!" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <button className="contained-button my-1 " type="submit">
          Register
        </button>
       
        <Link className="underline" to="/login">
          Already have an account ? <strong>Sign In</strong>
        </Link>
      </Form>
    </div>
  );
}

export default Register;
