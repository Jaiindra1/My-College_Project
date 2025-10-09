import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import FacultyDashboard from "./pages/Dashboard/FacultyDashboard";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import StudentList from "./pages/Students/StudentList";
import AddStudent from "./pages/Students/AddStudent";
import AttendanceUpload from "./pages/Attendance/AttendanceUpload";
import AttendanceSummary from "./pages/Attendance/AttendanceSummary";
import ExamList from "./pages/Exams/ExamList";
import AddExam from "./pages/Exams/AddExam";
import UploadResults from "./pages/Exams/UploadResults";
import SupplyResults from "./pages/Exams/SupplyResults";
import AttendanceList from "./pages/Attendance/AttendanceList";
import AddAttendance from "./pages/Attendance/AddAttendance";
import UploadAttendance from "./pages/Attendance/UploadAttendance";
import CompanyList from "./pages/Placements/CompanyList";
import AddCompany from "./pages/Placements/AddCompany";
import RegisterStudent from "./pages/Placements/RegisterStudent";
import UpdateStatus from "./pages/Placements/UpdateStatus";
import ManageFees from "./pages/Placements/ManageFees";
import FeeListManagement from './components/FeeManagement/FeeList';
import AddFee from './components/FeeManagement/AddFee';
import UpdateFee from './components/FeeManagement/UpdateFee';
import PendingFees from './components/FeeManagement/PendingFees';
import FeeDashboard from './components/FeeManagement/FeeDashboard.jsx';
import ManageStudentsAttendance from './components/Admin/ManageStudentsAttendance';
import AdminReports from "./pages/Reports/AdminReports";
import FacultyList from "./pages/Faculty/FacultyList";
import AddFaculty from "./pages/Faculty/AddFaculty";
import EditFaculty from "./pages/Faculty/EditFaculty";
import PlacementsDashboard from "./pages/Placements/PlacementsDashboard";
import NotificationsList  from "./pages/Notifications/NotificationsList.jsx";
import AddNotification from "./pages/Notifications/AddNotification.jsx";
import EditNotification from "./pages/Notifications/EditNotification.jsx";
import AdminTimetable from "./pages/Timetable/AdminTimetable";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/faculty" element={<PrivateRoute role="faculty"><FacultyDashboard /></PrivateRoute>} />
          <Route path="/student" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
          <Route path="/students" element={<PrivateRoute role="admin"><StudentList /></PrivateRoute>} />
          <Route path="/students/add" element={<PrivateRoute role="admin"><AddStudent /></PrivateRoute>} />
          <Route path="/attendance/upload" element={<PrivateRoute role="admin"><AttendanceUpload /></PrivateRoute>} />
          <Route path="/attendance/summary" element={<PrivateRoute role="admin"><AttendanceSummary /></PrivateRoute>} />
          <Route path="/exams" element={<PrivateRoute role="admin"><ExamList /></PrivateRoute>} />
          <Route path="/exams/add" element={<PrivateRoute role="admin"><AddExam /></PrivateRoute>} />
          <Route path="/exams/upload" element={<PrivateRoute role="admin"><UploadResults /></PrivateRoute>} />
          <Route path="/exams/supply" element={<PrivateRoute role="admin"><SupplyResults /></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute role="admin"><AttendanceList /></PrivateRoute>} />
          <Route path="/attendance/add" element={<PrivateRoute role="admin"><AddAttendance /></PrivateRoute>} />
          <Route path="/attendance/upload" element={<PrivateRoute role="admin"><UploadAttendance /></PrivateRoute>} />
          <Route path="/placements" element={<PrivateRoute role="admin"><PlacementsDashboard /></PrivateRoute>} />
          <Route path="/placements/companies" element={<PrivateRoute role="admin"><CompanyList /></PrivateRoute>} />
          <Route path="/placements/add-company" element={<PrivateRoute role="admin"><AddCompany /></PrivateRoute>} />
          <Route path="/placements/register-student" element={<PrivateRoute role="admin"><RegisterStudent /></PrivateRoute>} />
          <Route path="/placements/update-status" element={<PrivateRoute role="admin"><UpdateStatus /></PrivateRoute>} />
          <Route path="/placements/manage-fees" element={<PrivateRoute role="admin"><ManageFees /></PrivateRoute>} />
          <Route path="/admin/feesList" element={<FeeListManagement />} />
          <Route path="/admin/fees/add" element={<AddFee />} />
          <Route path="/admin/fees/update" element={<UpdateFee />} />
          <Route path="/admin/fees/pending" element={<PendingFees />} />
          <Route path="/admin/fees" element={<FeeDashboard />} />
          <Route path="/admin/students" element={<ManageStudentsAttendance />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/faculty" element={<FacultyList />} />
          <Route path="/admin/NotificationsList" element={<NotificationsList />} />
          <Route path="/admin/notifications-edit/:id" element={<EditNotification />} />
          <Route path="/admin/timetable" element={<PrivateRoute role="admin"><AdminTimetable /></PrivateRoute>}/>
          <Route path="/admin/Notifications-Add" element={<AddNotification />} />
          <Route path="/faculty/add" element={<AddFaculty />} />
          <Route path="/faculty/edit/:id" element={<EditFaculty />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
