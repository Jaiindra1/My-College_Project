import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function HelpDesk() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ subject: "", message: "" });

  const fetchTickets = async () => {
    const { data } = await api.get("/helpdesk");
    setTickets(data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/helpdesk", form);
    alert("✅ Ticket submitted");
    setForm({ subject: "", message: "" });
    fetchTickets();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Help Desk</h1>
      <form onSubmit={handleSubmit} className="space-y-2 mb-8">
        <input
          placeholder="Subject"
          className="border p-2 w-full rounded"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
        <textarea
          placeholder="Message"
          className="border p-2 w-full rounded"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <button className="bg-primary text-white px-4 py-2 rounded">Submit</button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Subject</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.ticket_id} className="border-t">
              <td className="p-2">{t.subject}</td>
              <td className="p-2">{t.status}</td>
              <td className="p-2">{t.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
