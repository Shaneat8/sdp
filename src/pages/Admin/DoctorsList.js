import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ShowLoader } from "../../redux/loaderSlice";
import { message, Table } from "antd";
import { getAllDoctor, UpdateDoctor } from "../../apicalls/doctors";
import { render } from "@testing-library/react";

function DoctorsList() {
  const [doctors, setDoctors] = React.useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(ShowLoader(true));
      const response = await getAllDoctor();
      dispatch(ShowLoader(false));
      if (response.success) {
        setDoctors(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  const changeStatus = async (payload) => {
    try {
      dispatch(ShowLoader(true));
      const response = await UpdateDoctor(payload);
      dispatch(ShowLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(ShowLoader(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "FirstName",
      dataIndex: "FirstName",
    },
    {
      title: "LastName",
      dataIndex: "LastName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Speciality",
      dataIndex: "speciality",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return text.toUpperCase();
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        if (record.status === "pending") {
          return (
            <div className="flex gap-1">
              <span
                className="cursor-pointer underline"
                onClick={() =>
                  changeStatus({
                    ...record,
                    status: "rejected",
                  })
                }
              >
                Reject
              </span>
              <span
                className="cursor-pointer underline"
                onClick={() =>
                  changeStatus({
                    ...record,
                    status: "approved",
                  })
                }
              >
                Approve{" "}
              </span>
            </div>
          );
        }
        if (record.status === "approved") {
          return (
            <div className="flex gap-1">
              <span
                className="cursor-pointer underline"
                onClick={() =>
                  changeStatus({
                    ...record,
                    status: "blocked",
                  })
                }
              >
                Block{" "}
              </span>
            </div>
          );
        }
        if (record.status === "blocked") {
          return (
            <div className="flex gap-1">
              <span
                className="cursor-pointer underline"
                onClick={() =>
                  changeStatus({
                    ...record,
                    status: "approved",
                  })
                }
              >
                Unblock{" "}
              </span>
            </div>
          );
        }
        if (record.status === "rejected") {
          return (
            <div className="flex gap-1">
              <span
                className="cursor-pointer underline"
                onClick={() =>
                  changeStatus({
                    ...record,
                    status: "approved",
                  })
                }
              >
                Approve{" "}
              </span>
            </div>
          );
        }
      },
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={doctors}></Table>
    </div>
  );
}

export default DoctorsList;
