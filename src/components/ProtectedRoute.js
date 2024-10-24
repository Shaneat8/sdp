import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function ProtectedRoute({ children }) {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      nav("/login");
    }
  }, [nav]);
  return (
    <div className="layout p-1 ">
      <div className="header bg-white p-2 flex justify-between items-center">
        <h2 className="cursor-pointer" onClick={() => nav("/")}>
          <strong className="text-primary">Swasthya</strong>
          <strong className="text-secondary"> Seva</strong>
        </h2>
        {user && (
          <div className="flex gap-3 items-center">
            <div className="flex gap-1 item-center cursor-pointer"
            onClick={() => {
              if (user.role === "admin") {
                nav("/admin");
              } else nav("/profile");
            }}>
              <i className="ri-shield-user-fill"></i>
              <h4
                className="uppercase cursor-pointer underline"

              >
                {user.name}
              </h4>
            </div>
            <i
              className="ri-logout-box-r-line cursor-pointer"
              onClick={() => {
                localStorage.removeItem("user");
                nav("/login");
              }}
            ></i>
          </div>
        )}
      </div>
      <div className="content my-1">{children}</div>
    </div>
  );
}

export default ProtectedRoute;
