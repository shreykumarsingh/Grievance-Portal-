# आवाज़ (Awaaz) - Public Grievance Redressal Portal 🏛️

**आवाज़** is an enterprise-grade, multi-tier Public Grievance Redressal Portal built on the MERN stack (MongoDB, Express.js, React.js, Node.js). It bridges citizens and local government bodies through transparent, role-based workflows, automated level-based escalation, inter-department transfers, and real-time audit logging.

---

## 🏗️ Multi-Tier Officer Hierarchy & Escalation System

The portal structures government officials into **3 distinct administrative levels** within every department (**Health**, **Education**, **Transport**, **Pension**, **Other**):

```
+-----------------------------------------------------------------------------------+
|                                 CITIZEN FILING                                    |
|              Citizen files a grievance under a specific department                |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| LEVEL 1 OFFICER (Gram Panchayat / Field Officer)                                  |
| • Receives initial complaints in their department & district.                      |
| • Conducts ground inspection, updates status ("in process", "resolved").          |
| • Can forward to Level 2 if higher administrative authority or funds are required.|
+-----------------------------------------------------------------------------------+
                                          |
                                          | [Forward Level]
                                          v
+-----------------------------------------------------------------------------------+
| LEVEL 2 OFFICER (Tehsildar / Block Level Officer)                                 |
| • Handles escalated grievances requiring inter-block or Tehsil level authority.    |
| • Reviews field feedback, issues directives, or resolves the grievance.           |
| • Can forward to Level 3 if district-wide policy intervention is needed.          |
+-----------------------------------------------------------------------------------+
                                          |
                                          | [Forward Level]
                                          v
+-----------------------------------------------------------------------------------+
| LEVEL 3 OFFICER (Municipal Corporation / District Head)                           |
| • Highest administrative authority for the department in the district.            |
| • Reviews systemic issues, issues final directives, and marks resolution.         |
+-----------------------------------------------------------------------------------+
```

### 🔁 Inter-Officer Communication & Transfer Workflows

1. **Level Escalation (`Forward` Action)**:
   - When a Level 1 or Level 2 officer determines that a grievance requires higher administrative clearance or budget allocation, they use the **Forward** action.
   - The system automatically transfers the grievance to the higher-level officer (`Level + 1`) within the same district and department.
   - Both officers receive automated audit log entries in the complaint's `actionHistory`.

2. **Department Re-assignment (`Transfer to Department`)**:
   - If a citizen files a grievance under the wrong field (e.g., a road hazard filed under *Health* instead of *Transport*), officers can re-assign the complaint via **Transfer to Department**.
   - The grievance is immediately routed to officers in the target department, ensuring no complaint is lost due to miscategorization.

3. **Complete Audit Trail & Action History**:
   - Every status change (`pending` ➔ `in process` ➔ `resolved`), officer note, level escalation, and department transfer is permanently recorded with timestamps.
   - Accessible by Citizens, Officers, and Admins to ensure total transparency.

---

## 🌟 Portals & Key Features

### 👤 1. Citizen Portal
- **File Grievances**: Submit complaints with subject, description, department, and contact details.
- **Real-Time Tracking**: Track status (`pending`, `in process`, `resolved`), completion date/time, and assigned officers.
- **Reminder Cooldown**: Send automated reminders to officers with an accurate 7-day cooldown guard.
- **Officer Ratings**: Rate officers (1 to 5 Stars) upon resolution.
- **Reopen & Delete**: Reopen unresolved grievances or delete pending complaints.

### 👮 2. Officer Portal
- **Department Dashboard**: View all active grievances belonging to the officer's department and district.
- **Update Status**: Update grievance status (`pending`, `in process`, `resolved`) with officer feedback.
- **Completion Date & Time**: Input exact completion timestamps when resolving complaints.
- **Level Escalation & Transfer**: Escalate to higher level officers or transfer to another department in one step.
- **Officer Profile & Rating**: View personal profile, designation level, and citizen rating statistics.

### 👑 3. Admin Portal
- **District Overview Dashboard**: View summary statistics and district-wide grievance metrics.
- **Department Filtering**: Filter district grievances in real-time by department (*Health*, *Education*, *Transport*, *Pension*, *Other*).
- **Officer Management**: View all district officers across departments and levels, along with task resolution metrics and citizen ratings.
- **Appoint Officers**: Register new Level 1, 2, or 3 officers for any department.

---

## 🔑 Pre-Configured Test Credentials

| Role | Email / Username | Password | District / Level / Dept |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `password` | District: **Bengaluru** |
| **Health L1 Officer** | `health1@gmail.com` | `password` | Level 1 • Health |
| **Health L2 Officer** | `health2@gmail.com` | `password` | Level 2 • Health |
| **Health L3 Officer** | `health3@gmail.com` | `password` | Level 3 • Health |
| **Education L1 Officer**| `education1@gmail.com`| `password` | Level 1 • Education |
| **Transport L1 Officer**| `transport1@gmail.com`| `password` | Level 1 • Transport |
| **Pension L1 Officer**  | `pension1@gmail.com`  | `password` | Level 1 • Pension |
| **Other L1 Officer**    | `other1@gmail.com`    | `password` | Level 1 • Other |
| **Citizen User** | `onkarraj976@gmail.com` | `password` | District: **Bengaluru** |

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), TailwindCSS, Axios, Moment.js.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.js, Nodemailer.

---

## 🚀 Quick Setup & Local Installation

### Prerequisites
- Node.js (v18+)
- Local MongoDB running on `mongodb://localhost:27017`

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/shreykumarsingh/Grievance-Portal-.git
cd "Grievance Portal"

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration
Create a `.env` file inside the `server/` directory:
```env
MONGO_URI=mongodb://localhost:27017/grievance-portal
JWT_SECRET=your_jwt_secret_key
JWT_LIFETIME=30d
```

### 3. Run Application
```bash
# Start backend server (Port 3000)
cd server
npm start

# Start frontend dev server (Port 5173) in a second terminal
cd client
npm run dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.
