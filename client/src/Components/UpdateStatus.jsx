import React from "react";
import axios from "axios";
import Loading from "./Loading";
export default function UpdateStatus(props) {
  const token=localStorage.getItem("token")
  const [id, setId] = React.useState("");
  function handleIDChange(e) {
    setId(e.target.value);
  }
  const [data, setData] = React.useState({
    status: "pending",
    feedback: "",
    completionDateTime: new Date().toISOString().slice(0, 16),
    targetDepartment: ""
  });
  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  const [loading, setLoading] = React.useState(false);

  function onSubmit(e){
    e.preventDefault();
    if (!id || id.trim() === "") {
      alert("Please enter the grievance ID first");
      return;
    }
    if(data.status === "" && data.feedback === "" && !data.targetDepartment){
      alert("Please fill in valid changes or select a target department to transfer");
      return;
    }
    if(data.status === "resolved" && !data.completionDateTime) {
      alert("Please select the completion date and time");
      return;
    }

    setLoading(true);
    const currentToken = localStorage.getItem("token");

    // If targetDepartment is chosen and differs, send pass/transfer request first
    const patchUrl = (data.targetDepartment && data.targetDepartment !== complaint.department)
      ? `/api/v1/tasks/pass/${id.trim()}`
      : `/api/v1/tasks/feedback/${id.trim()}`;

    let patchReqConfig = {
      method: "patch",
      maxBodyLength: Infinity,
      url: patchUrl,
      headers: {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(patchReqConfig)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setLoading(false);
        alert("Status Updated Successfully");
        window.location.reload(true);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        const errMsg = error.response?.data?.msg || error.response?.data?.message || error.message || "Failed to update status";
        alert("Error Occurred: " + errMsg);
      }); 
  }

  const [complaint, setComplaint] = React.useState({
    subject:"",
    description:"",
    department:"",
    status:"",
    createdAt:""
  });

  function onSubmitId(e){
    e.preventDefault();
    if(!id || id.trim() === ""){
      alert("Please enter the grievance ID");
      return;
    }
    setLoading(true);
    const currentToken = localStorage.getItem("token");
    let getReqConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `/api/v1/tasks/${id.trim()}`,
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    };
    axios
      .request(getReqConfig)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setComplaint(response.data.complaint);
        setData(prev => ({ ...prev, status: response.data.complaint.status || "pending" }));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        const errMsg = error.response?.data?.msg || error.response?.data?.message || error.message || "Grievance ID not found";
        alert("Error Occurred: " + errMsg);
      });
  }
  console.log(data.status)
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
          props.visible == "new"
            ? "p-4 view-grievance dashboard w-full md:w-3/4 min-h-screen pb-24 pt-4 overflow-y-auto"
            : "hidden"
        }
      >
        <h1 className="text-2xl text-center md:hidden">
          Enter the Grievance ID:
        </h1>
        <div className="flex justify-center mt-4">
          <div className="get-details-form flex justify-center border-2 w-4/6 p-4 rounded-xl shadow-2xl bg-white">
            <form action="" className="px-3">
              <label
                htmlFor="id"
                className="hidden md:block mx-auto md:mb-4 text-xl font-medium text-center"
              >
                ENTER THE GRIEVANCE ID:
              </label>
              <input
                type="text"
                id="id"
                placeholder="Grievance ID"
                className="border1 border border-black mx-auto  md:ml-3 md:mt-0 rounded-md p-1"
                name="id"
                onChange={handleIDChange}
              />
              <button
                type="submit"
                className=" hover:animate-bounce border-1 border-black border p-2 ml-2  md:m-0 rounded-xl bg-light-green text-white md:ml-8"
                onClick={(e) => onSubmitId(e)}
              >
                GET DETAILS
              </button>
              {loading && <Loading />}
            </form  >
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl text-center mt-4 md:mt-8 font-semibold">
          GRIEVANCE INFORMATION
        </h1>
        <div className="flex justify-center md:mt-4 mb-16">
          <form
            action=""
            className="mt-4 md:mt-6 px-6 border-2 p-6 mb-16 rounded-xl shadow-2xl md:w-4/6 bg-white"
          >
            <div className="md:flex justify-start mx-auto items-center mb-4">
              <div className="name flex justify-start mx-auto md:m-0 items-center">
                <h1 className="text-lg md:text-xl font-semibold">Subject:</h1>
                <h1 className="text-lg md:text-xl ml-2 md:ml-4">
                  {complaint.subject}
                </h1>
              </div>
            </div>

            <div className="name flex justify-start mx-auto mt-4 ">
              <h1 className="text-lg md:text-xl font-semibold">Description:</h1>
              <h1 className="text-lg md:text-xl ml-2 md:ml-4">
                {complaint.description}
              </h1>
            </div>
            <div className="md:flex justify-start items-center mt-4">
              <div className="name flex justify-start mx-auto md:m-0 items-center">
                <h1 className="text-lg md:text-xl font-semibold">
                  Department:
                </h1>
                <h1 className=" text-lg md:text-xl ml-2 md:ml-4">
                  {complaint.department}
                </h1>
              </div>
              <div className="name flex justify-start mx-auto md:ml-16 mt-2 md:mt-0 items-center">
                <h1 className="text-lg md:text-xl font-semibold">
                  Current Status:
                </h1>
                <h1 className="text-lg md:text-xl ml-2 md:ml-4 font-bold capitalize">
                  {complaint.status}
                </h1>
              </div>
            </div>
            <div className="name flex justify-start mx-auto mt-4 items-center">
              <h1 className="text-lg md:text-xl font-bold text-gray-800">
                Date of Filing:
              </h1>
              <h1 className="text-lg md:text-xl ml-2 md:ml-4 font-semibold text-gray-700">
                {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : ''}
              </h1>
            </div>
            {complaint.status === "resolved" && complaint.completionDateTime && (
              <div className="name flex justify-start mx-auto mt-4 items-center">
                <h1 className="text-lg md:text-xl font-semibold text-green-700">Completion Date & Time:</h1>
                <h1 className="text-lg md:text-xl ml-2 md:ml-4 font-bold">
                  {new Date(complaint.completionDateTime).toLocaleString()}
                </h1>
              </div>
            )}
            {complaint.status != "resolved" && (
              <>
                <div className="name flex justify-start mx-auto mt-4 items-center">
                  <label
                    htmlFor="status"
                    className="text-lg md:text-xl font-semibold"
                  >
                    Status:
                  </label>
                  <select
                    name="status"
                    id="status"
                    className="border border-black mx-auto md:ml-3 md:mt-0 rounded-md p-1 font-medium"
                    value={data.status}
                    onChange={handleChange}
                  >
                    <option value="pending">pending</option>
                    <option value="in process">in process</option>
                    <option value="resolved">resolved</option>
                  </select>
                </div>
                <div className="name flex justify-start mx-auto mt-4 items-center">
                  <label
                    htmlFor="targetDepartment"
                    className="text-lg md:text-xl font-semibold text-blue-800"
                  >
                    Transfer to Department (Optional):
                  </label>
                  <select
                    name="targetDepartment"
                    id="targetDepartment"
                    className="border border-black mx-auto md:ml-3 md:mt-0 rounded-md p-1 font-medium"
                    value={data.targetDepartment || ""}
                    onChange={handleChange}
                  >
                    <option value="">--No Transfer (Keep Current)--</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Transport">Transport</option>
                    <option value="Pension">Pension</option>
                    <option value="other">other</option>
                  </select>
                </div>
                {data.status === "resolved" && (
                  <div className="name flex mx-auto mt-4 items-center">
                    <label
                      htmlFor="completionDateTime"
                      className="text-lg md:text-xl font-semibold"
                    >
                      Completion Date & Time:
                    </label>
                    <input
                      type="datetime-local"
                      name="completionDateTime"
                      id="completionDateTime"
                      value={data.completionDateTime}
                      className="border border-black mx-auto ml-4 md:ml-3 md:mt-0 rounded-md p-1"
                      onChange={handleChange}
                    />
                  </div>
                )}
                <div className="name flex mx-auto mt-4 items-center">
                  <label
                    htmlFor="feedback"
                    className="text-lg md:text-xl font-semibold"
                  >
                    Feedback:
                  </label>
                  <input
                    type="text"
                    name="feedback"
                    id="feedback"
                    placeholder="Enter Feedback"
                    className="border border-black mx-auto ml-4 md:ml-3 md:mt-0 rounded-md p-1 w-2/3"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-end mt-6 pt-4 border-t">
                  <button
                    type="submit"
                    className="hover:animate-bounce border border-black p-3 w-36 rounded-xl bg-light-green text-white font-bold text-lg shadow-md"
                    onClick={(e) => onSubmit(e)}
                  >
                    Submit
                  </button>
                  {loading && <Loading />}
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
