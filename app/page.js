"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [newNumber, setNewNumber] = useState("");
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [message, setMessage] = useState("");
  const [sendAt, setSendAt] = useState("");
  const [jobs, setJobs] = useState([]);

  // Add number
  const addNumber = () => {
    if (!newNumber.trim() || contacts.includes(newNumber)) return;
    setContacts([...contacts, "+91"+newNumber]);
    setNewNumber("");
  };

  // Toggle select number
  const toggleSelect = (number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  // Schedule message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedNumbers.length === 0) return alert("Select at least one number");

    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numbers: selectedNumbers, message, sendAt }),
    });
    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
    fetchJobs(); // refresh job list
  };

  // Fetch scheduled jobs from API
  const fetchJobs = async () => {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    if (data.jobs) setJobs(data.jobs);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">📱 WhatsApp Scheduler</h1>

      {/* Add Number Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Numbers</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter number (+91...)"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-gray-700 border border-gray-600"
          />
          <button onClick={addNumber} className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
            Add
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          {contacts.map((num) => (
            <li key={num} className="flex items-center gap-2">
              <input type="checkbox" checked={selectedNumbers.includes(num)} onChange={() => toggleSelect(num)} />
              <span>{num}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Schedule Message Section */}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Schedule Message</h2>
        <textarea
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600"
        />
        <input
          type="datetime-local"
          value={sendAt}
          onChange={(e) => setSendAt(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600"
        />
        <button type="submit" className="w-full bg-green-500 py-2 rounded hover:bg-green-600">
          Schedule Message
        </button>
      </form>

      {/* Scheduled Jobs Table */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">Scheduled Messages</h2>
        {jobs.length === 0 ? (
          <p>No scheduled messages</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 px-3 py-1">#</th>
                <th className="border border-gray-600 px-3 py-1">Numbers</th>
                <th className="border border-gray-600 px-3 py-1">Message</th>
                <th className="border border-gray-600 px-3 py-1">Scheduled At</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, idx) => (
                <tr key={job.id} className="odd:bg-gray-700 even:bg-gray-600">
                  <td className="border border-gray-600 px-3 py-1">{idx + 1}</td>
                  <td className="border border-gray-600 px-3 py-1">{job.numbers.join(", ")}</td>
                  <td className="border border-gray-600 px-3 py-1">{job.message}</td>
                  <td className="border border-gray-600 px-3 py-1">{job.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
