import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardEmployee from "./pages/DashboardEmployee";
import EmployeeList from "./pages/EmployeeList";
import Register from "./Register";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      <Route path="/admin/employees" element={<EmployeeList />} />
      <Route path="/admin/register" element={<Register />} />
      <Route path="/employee/dashboard" element={<DashboardEmployee />} />
    </Routes>
  );
}

export default AppRouter;
