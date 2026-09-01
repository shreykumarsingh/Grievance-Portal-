import React, { Fragment } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
export default function ViewOfficerDetails(props) {
  const [officerDetails, setOfficerDetails] = React.useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/api/v1/manage/getOfficerData",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setOfficerDetails(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  function checkLogin() {
    if (!token) {
      navigate("/userAdminLogin");
    }
  }
  return (
    <>
      {checkLogin}
      <div
        className={
          props.visible == "view"
            ? "p-4 view-officer-details dashboard w-full md:w-3/4 h-100  pt-10  "
            : "hidden"
        }
      >
      {loading && <Loading />}
        <h1 className="text-center text-4xl md:text-7xl font-semibold">
          OFFICER DETAILS
        </h1>
        <section className="container mx-auto font-mono flex justify-center">
          <div className=" pt-4 mb-8 overflow-y-scroll overflow-x-scroll h-120  mt-4 border-2 shadow-2xl rounded-xl p-6 overflow-hidden w-11/12 md:w-5/6">
            <div className="w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Level</th>
                    <th className="px-4 py-3 mx-auto">Avg Rating</th>
                    <th className="px-4 py-3 mx-auto">Pending</th>
                    <th className="px-4 py-3 mx-auto">In Process</th>
                    <th className="px-4 py-3 mx-auto">Resolved</th>
                  </tr>
                </thead>
                <tbody className="bg-white">{officerData}</tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
