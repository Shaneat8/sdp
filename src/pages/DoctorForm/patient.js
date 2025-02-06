import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Col, Form, Input, message, Row } from "antd";
import moment from "moment";
import { ShowLoader } from "../../redux/loaderSlice";
import { GetPatientDetails, AddMedicineDiagnosis } from "../../apicalls/users";

function Patient() {
  const [patientData, setPatientData] = useState(null);
  const [loading, showLoader] = useState(false);
  const [medicineForm] = Form.useForm();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { patientId } = useParams();

  // Fetch patient data
  const fetchPatientData = async () => {
    try {
      dispatch(ShowLoader(true));
      const response = await GetPatientDetails(patientId);
      if (response.success) {
        setPatientData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(ShowLoader(false));
    }
  };
  
  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  // Handle adding diagnosis and medicine
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoader(true));
      const payload = {
        ...values,
        patientId,
        timestamp: new Date().toISOString(),
      };
      const response = await AddMedicineDiagnosis(payload);
      if (response.success) {
        message.success("Diagnosis and medicine added successfully!");
        medicineForm.resetFields();
        fetchPatientData(); // Refetch patient data to reflect changes
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(ShowLoader(false));
    }
  };

  return (
    <div>
      {/* Display Patient Information */}
      <div className="flex flex-column my-1 p-1 bg-white gap-1">
        <div className="flex gap-2">
          <h4>
            <b>First Name:</b> {patientData?.FirstName || "N/A"}
          </h4>
          <h4>
            <b>Last Name:</b> {patientData?.LastName || "N/A"}
          </h4>
        </div>
        <div className="flex gap-2">
          <h4>
            <b>DOB:</b> {moment(patientData?.DOB).format("DD-MM-YYYY") || "N/A"}
          </h4>
        </div>
        <div className="flex gap-2">
          <h4>
            <b>Gender:</b> {patientData?.gender === 1 ? "Male" : "Female"}
          </h4>
        </div>
        <div className="flex gap-2">
          <h4>
            <b>Phone:</b> {patientData?.phone || "N/A"}
          </h4>
          <h4>
            <b>Email:</b> {patientData?.email || "N/A"}
          </h4>
        </div>
        <div className="flex gap-2">
          <h4>
            <b>Address:</b> {patientData?.address || "N/A"}
          </h4>
        </div>
        <div className="flex gap-2">
          <h4>
            <b>Pin Code:</b> {patientData?.pinCode || "N/A"}
          </h4>
        </div>
        <div className="flex gap-2">
          <h4>
            <b>Aadhar:</b> {patientData?.aadhar || "N/A"}
          </h4>
        </div>
        <div className="flex gap-2">
          <h4>
            <b>Guardian Name:</b> {patientData?.gName || "N/A"}
          </h4>
          <h4>
            <b>Guardian Phone:</b> {patientData?.gPhone || "N/A"}
          </h4>
        </div>
        <div className="flex gap-2">
          <h4>
            <b>Guardian Address:</b> {patientData?.gAddress || "N/A"}
          </h4>
        </div>
        <div className="flex gap-2">
          <h4>
            <b>Guardian Pin Code:</b> {patientData?.gPinCode || "N/A"}
          </h4>
        </div>
        <div className="flex gap-2">
          <h4>
            <b>Details:</b> {patientData?.details || "N/A"}
          </h4>
        </div>
      </div>

      {/* Add Diagnosis and Medicine Form */}
      <div className="bg-white p-2">
        <h3>Add Diagnosis and Prescribe Medicine</h3>
        <hr />
        <Form
          onFinish={onFinish}
          form={medicineForm}
          layout="vertical"
          className="my-1"
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Diagnosis"
                name="diagnosis"
                rules={[{ required: true, message: "Please enter diagnosis!" }]}
              >
                <Input.TextArea rows={3} placeholder="Enter diagnosis" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Medicine"
                name="medicine"
                rules={[{ required: true, message: "Please prescribe medicine!" }]}
              >
                <Input.TextArea rows={3} placeholder="Enter prescribed medicine" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Button
                className="contained-btn"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Add Diagnosis & Medicine
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Display Previous Prescriptions (if any) */}
      {patientData?.prescriptions?.length > 0 && (
        <div className="bg-white p-2 my-2">
          <h3>Previous Prescriptions</h3>
          <hr />
          {patientData.prescriptions.map((prescription, index) => (
            <div key={index} className="my-1">
              <p>
                <b>Diagnosis:</b> {prescription.diagnosis}
              </p>
              <p>
                <b>Medicine:</b> {prescription.medicine}
              </p>
              <p>
                <b>Date:</b>{" "}
                {moment(prescription.timestamp).format("DD-MM-YYYY hh:mm A")}
              </p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Patient;
