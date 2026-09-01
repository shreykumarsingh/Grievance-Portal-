import React, { Fragment } from "react";
import axios from "axios";
import Loading from "./Loading";
import Modal from "./Modal";

export default function AdminGrievanceView(props) {
  const [complaints, setComplaints] = React.useState([]);
  const [selectedDepartment, setSelectedDepartment] = React.useState("All");
  const [loading, setLoading] = React.useState(true);
  const [isVisible, setIsVisible] = React.useState(false);
  const [actionHistory, setActionHistory] = React.useState([]);
  const token = localStorage.getItem("token");

  React.useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/api/v1/manage/getComplaints",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(config)
      .then((response) => {
        setComplaints(response.data.complaints || []);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  function handleAction(complaint) {
    setActionHistory(complaint.actionHistory || []);
    setIsVisible((prev) => !prev);
  }

  const filteredComplaints = complaints.filter(
    (c) => selectedDepartment === "All" || c.department === selectedDepartment
  );

  const complaintRows = filteredComplaints.map((c) => (
    <tr
      key={c._id}
      className={
        c.status === "pending"
          ? "bg-red"
          : c.status === "resolved"
          ? "bg-green"
          : "bg-yellow"
      }
    >
      <td className="px-4 py-3 text-ms font-semibold border">{c._id}</td>
      <td className="px-4 py-3 text-ms font-semibold border">
        {c.createdBy ? `${c.createdBy.name} (${c.createdBy.email})` : c.contact || "N/A"}
      </td>
      <td className="px-4 py-3 text-ms font-semibold border">{c.department}</td>
      <td className="px-4 py-3 text-ms font-semibold border">{c.subject}</td>
      <td className="px-4 py-3 text-ms font-semibold border">{c.description}</td>
      <td className="px-4 py-3 text-ms font-semibold border">
        {c.officerID ? `${c.officerID.name} (L${c.officerID.level})` : "Unassigned"}
      </td>
      <td className="px-4 py-3 text-ms font-semibold border">{c.status}</td>
      <td className="px-4 py-3 text-ms font-semibold border">
        {c.createdAt ? new Date(c.createdAt).toLocaleString() : "N/A"}
      </td>
      <td className="px-4 py-3 text-ms font-semibold border">
        {c.completionDateTime
          ? new Date(c.completionDateTime).toLocaleString()
          : (c.status === "resolved" ? "Resolved" : "N/A")}
      </td>
      <td className="px-4 py-3 text-ms font-semibold border">
        <button
          className="bg-light-green hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleAction(c)}
        >
          View
        </button>
      </td>
    </tr>
  ));

  return (
    <div
      className={
        props.visible === "update"
          ? "p-4 view-grievance dashboard w-full md:w-3/4 h-100 pt-10"
          : "hidden"
      }
    >
      {loading && <Loading />}
      <h1 className="text-center font-bold text-3xl md:text-6xl mb-4">
        DISTRICT GRIEVANCES
      </h1>

      {/* Department Filter Selector */}
      <div className="flex justify-center mb-6 items-center gap-4">
        <label htmlFor="deptFilter" className="text-lg md:text-xl font-semibold text-gray-800">
          Filter by Department:
        </label>
        <select
          id="deptFilter"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="border-2 border-black rounded-lg p-2 text-base md:text-lg font-medium bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Departments</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Transport">Transport</option>
          <option value="Pension">Pension</option>
          <option value="other">other</option>
        </select>
      </div>

      <div className="flex justify-center">
        <div className="md:w-5/6 mb-8 overflow-y-scroll overflow-x-scroll h-120 border-2 shadow-2xl rounded-xl p-6">
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray uppercase">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Citizen</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Assigned Officer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Filing Time</th>
                  <th className="px-4 py-3">Completion Time</th>
                  <th className="px-4 py-3">Action History</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {complaintRows.length > 0 ? (
                  complaintRows
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-6 text-lg font-semibold text-gray-600">
                      No grievances found for department: {selectedDepartment}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal
        visible={isVisible}
        setVisible={setIsVisible}
        data={actionHistory}
      />
    </div>
  );
}
