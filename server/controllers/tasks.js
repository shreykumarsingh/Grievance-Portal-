const Complaint = require("../models/Complaint");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const User = require("../models/User");
const Officer = require("../models/Officer");
const sendEmail = require("../utils/sendEmail");
const { config } = require("dotenv");

require('dotenv').config();

const getAllTasks = async (req, res) => {
  const officer = await Officer.findById(req.officer.officerId);
  if (!officer) {
    throw new NotFoundError("Officer not found");
  }

  const tasks = await Complaint.find({
    $or: [
      { department: officer.department },
      { officerID: officer._id }
    ]
  }).sort("-createdAt");

  res.status(StatusCodes.OK).json({ count: tasks.length, tasks });
};

const getTask = async (req, res) => {
  const {
    params: { id: complaintId },
  } = req;

  const complaint = await Complaint.findOne({ _id: complaintId });
  if (!complaint) {
    throw new NotFoundError("Complaint not found");
  }
  res.status(StatusCodes.OK).json({ complaint });
};


const passTask = async (req, res) => {
  const {
    body: { forwardedTo, targetDepartment, department },
    officer: { officerId },
    params: { id: complaintId },
  } = req;

  const officer = await Officer.findOne({ _id: officerId });
  const compl = await Complaint.findOne({ _id: complaintId });
  if (!compl) {
    throw new NotFoundError("complaint not found");
  }

  if (compl.officerID.toString() !== officerId && compl.department !== officer.department) {
    throw new UnauthenticatedError("not authorized to update this task");
  }
  if (compl.status === "resolved") {
    throw new BadRequestError("Complaint already resolved. It can't be passed.");
  }

  const selectedDepartment = targetDepartment || department;
  if (selectedDepartment && selectedDepartment !== compl.department) {
    let newOfficer = await Officer.findOne({
      district: officer.district,
      department: selectedDepartment,
      level: 1,
    });
    if (!newOfficer) {
      newOfficer = await Officer.findOne({
        district: officer.district,
        department: selectedDepartment,
      });
    }
    if (!newOfficer) {
      newOfficer = await Officer.findOne({
        department: selectedDepartment,
      });
    }
    if (!newOfficer) {
      throw new NotFoundError(`No officer available in ${selectedDepartment} department`);
    }

    compl.department = selectedDepartment;
    compl.officerID = newOfficer._id;
    await compl.save();

    await compl.addFeedback(
      officer.name,
      officer.level,
      `Transferred complaint from ${officer.department} to ${selectedDepartment} department`
    );
    await compl.addFeedback(
      newOfficer.name,
      newOfficer.level,
      `Complaint received by ${selectedDepartment} department officer (${newOfficer.name})`
    );

    const body = `Your complaint "${compl.subject}" has been transferred to the ${selectedDepartment} department.`;
    const user = await User.findOne({ _id: compl.createdBy });
    if (user && user.email) {
      await sendEmail({
        to: user.email,
        subject: `Department Update about your grievance "${compl.subject}"`,
        text: `Update: ${body}`,
      });
    }

    return res.status(StatusCodes.OK).json({ complaint: compl });
  }

  let newOfficerId = await Officer.findOne({
    level: officer.level + 1,
    department: officer.department,
    district: officer.district,
  });

  if (!newOfficerId) {
    newOfficerId = await Officer.findOne({
      level: { $gt: officer.level },
      department: officer.department,
      district: officer.district,
    });
  }

  if (!newOfficerId) {
    newOfficerId = await Officer.findOne({
      level: { $gt: officer.level },
      department: officer.department,
    });
  }

  if (!newOfficerId) {
    throw new NotFoundError(
      `No higher level officer available in ${officer.department} department`
    );
  }

  const complaint = await Complaint.findByIdAndUpdate(
    complaintId,
    { officerID: newOfficerId.id },
    { new: true, runValidators: true }
  );

  await complaint.addFeedback(
    officer.name,
    officer.level,
    `Forwarded the complaint to the level ${newOfficerId.level} officer`
  );
  await complaint.addFeedback(
    newOfficerId.name,
    newOfficerId.level,
    `Complaint received by level ${newOfficerId.level} officer`
  );

  const body = `Complaint transferred to the level ${newOfficerId.level} officer`;

  const user = await User.findOne({ _id: complaint.createdBy });
  if (user && user.email) {
    await sendEmail({
      to: user.email,
      subject: `New Update about your grievance "${complaint.subject}"`,
      text: `Update: ${body}`,
    });
  }

  res.status(StatusCodes.OK).json({ complaint });
};

const updateTask = async (req, res) => {
  const {
    body: { feedback },
    officer: { officerId },
    params: { id: complaintId },
  } = req;

  if (req.body.feedback === "" && req.body.status === "" || !req.body.feedback && !req.body.status) {
    throw new BadRequestError("Please provide valid task changes");
  }

  const officer = await Officer.findOne({ _id: officerId });

  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    throw new NotFoundError("complaint not found");
  }
  if (complaint.status === "resolved") {
    throw new BadRequestError("Complaint already resolved. No more updations allowed.")
  }

  const isAssignedOfficer = complaint.officerID && complaint.officerID.toString() === officerId;
  if (!isAssignedOfficer && complaint.department !== officer.department) {
    throw new UnauthenticatedError("not authorized to update this task");
  }

  if (req.body.status === complaint.status && !req.body.feedback) {
    throw new BadRequestError("Duplicate changes not allowed. Add valid feedback or change status.")
  }

  // console.log(req.body.status)
  // console.log(req.body.feedback)

  if (req.body.status) {
    await complaint.updateStatus(req.body.status);
    if (req.body.status === "resolved") {
      const completionTime = req.body.completionDateTime || Date.now();
      await complaint.setCompletionDateTime(completionTime);
    }
  }

  if (req.body.feedback) {
    await complaint.addFeedback(officer.name, officer.level, req.body.feedback);
  } else {
    await complaint.addFeedback(officer.name, officer.level, `Status updated.`);
  }

  const completionStr = complaint.completionDateTime
    ? ` on ${new Date(complaint.completionDateTime).toLocaleString()}`
    : "";
  const bod = req.body.status === "resolved"
    ? `Your grievance "${complaint.subject}" has been RESOLVED${completionStr}.`
    : `Status updated about your grievance "${complaint.subject}" to "${req.body.status}".`;

  const user = await User.findOne({ _id: complaint.createdBy });
  if (user && user.email) {
    await sendEmail({ to: user.email, subject: `New Update about your grievance "${complaint.subject}"`, text: `Update: ${bod}` });
  }

  res.status(StatusCodes.OK).json({ complaint });
};



// const sendSMS = async (to, body) => {
//   try {
//     const message = await client.messages.create({
//       body: body,
//       from: '+15075162002',
//       to: to
//     });

//     console.log('Message sent: %s', message.sid);
//   } catch (err) {
//     console.error(err);
//   }
// };


module.exports = { getAllTasks, getTask, passTask, updateTask };

