import React from "react";

const SummaryTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p className="mt-6 text-center text-gray-500 text-sm">
        No results to display.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        📝 Grading Summary
      </h2>
      <table className="min-w-full text-sm border border-gray-200 rounded-md overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
            <th className="px-4 py-3 border">Student Name</th>
            <th className="px-4 py-3 border">Roll Number</th>
            <th className="px-4 py-3 border">Total Marks</th>
            <th className="px-4 py-3 border">Report</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="border px-4 py-2">
                {row.student_name || `Student ${index + 1}`}
              </td>
              <td className="border px-4 py-2">{row.roll_number || "—"}</td>
              <td className="border px-4 py-2 font-medium text-blue-600">
                {row.marks ?? "—"}
              </td>
              <td className="border px-4 py-2">
                <a
                  href={`http://localhost:8000/api/download/report/${row.student_id}`}
                  className="text-blue-600 hover:underline"
                  download
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
