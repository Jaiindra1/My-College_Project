import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axiosInstance";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    try {
      const { data } = await api.get("/placements/company");
      setCompanies(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Company Drives</h1>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Company</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">CTC</th>
              <th className="p-2 border">Drive Date</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {companies.map(c => (
              <tr key={c.company_id}>
                <td className="p-2 border">{c.name}</td>
                <td className="p-2 border">{c.role}</td>
                <td className="p-2 border">{c.ctc}</td>
                <td className="p-2 border">{c.drive_date || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyList;
