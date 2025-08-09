// // import React from "react";

// // const SummaryTable = ({ data }) => {
// //   if (!data || data.length === 0) {
// //     return (
// //       <p className="mt-6 text-center text-gray-500 text-sm">
// //         No results to display.
// //       </p>
// //     );
// //   }

// //   return (
// //     <div className="overflow-x-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
// //       <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
// //         📝 Grading Summary
// //       </h2>
// //       <table className="min-w-full text-sm border border-gray-200 rounded-md overflow-hidden">
// //         <thead>
// //           <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
// //             <th className="px-4 py-3 border">Student Name</th>
// //             <th className="px-4 py-3 border">Roll Number</th>
// //             <th className="px-4 py-3 border">Total Marks</th>
// //             <th className="px-4 py-3 border">Report</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {data.map((row, index) => (
// //             <tr
// //               key={index}
// //               className="hover:bg-gray-50 transition-colors duration-150"
// //             >
// //               <td className="border px-4 py-2">
// //                 {row.student_name || `Student ${index + 1}`}
// //               </td>
// //               <td className="border px-4 py-2">{row.roll_number || "—"}</td>
// //               <td className="border px-4 py-2 font-medium text-blue-600">
// //                 {row.marks ?? "—"}
// //               </td>
// //               <td className="border px-4 py-2">
// //                 <a
// //                   href={`http://localhost:8000/api/download/report/${row.student_id}`}
// //                   className="text-blue-600 hover:underline"
// //                   download
// //                 >
// //                   Download
// //                 </a>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default SummaryTable;

// import React from "react";

// const SummaryTable = ({ data }) => {
//   // New function to handle the file download process
//   const handleDownload = async (studentId, studentName) => {
//     // Default filename if studentId is missing, though it shouldn't be.
//     const filename = studentId ? `${studentId}_report.pdf` : "report.pdf";

//     try {
//       // 1. Fetch the file from your FastAPI backend
//       const response = await fetch(
//         `http://localhost:8000/api/download/report/${studentId}`
//       );

//       // Check if the request was successful
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({})); // Try to get error details
//         throw new Error(
//           errorData.error || `HTTP error! status: ${response.status}`
//         );
//       }

//       // 2. Get the file data as a Blob (a file-like object)
//       const blob = await response.blob();

//       // 3. Create a temporary URL for the Blob
//       const url = window.URL.createObjectURL(blob);

//       // 4. Create a temporary link element to trigger the download
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", filename); // Set the desired filename

//       // Append to the document, click it, and then remove it
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);

//       // 5. Clean up the temporary URL
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download failed:", error);
//       alert(
//         `Could not download the report for ${studentName}. Please try again. \nError: ${error.message}`
//       );
//     }
//   };

//   if (!data || data.length === 0) {
//     return (
//       <p className="mt-6 text-center text-gray-500 text-sm">
//         No results to display.
//       </p>
//     );
//   }

//   return (
//     <div className="overflow-x-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
//         📝 Grading Summary
//       </h2>
//       <table className="min-w-full text-sm border border-gray-200 rounded-md overflow-hidden">
//         <thead>
//           <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
//             <th className="px-4 py-3 border">Student Name</th>
//             <th className="px-4 py-3 border">Roll Number</th>
//             <th className="px-4 py-3 border">Total Marks</th>
//             <th className="px-4 py-3 border">Report</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, index) => (
//             <tr
//               key={row.student_id || index} // Use a stable key like student_id
//               className="hover:bg-gray-50 transition-colors duration-150"
//             >
//               <td className="border px-4 py-2">
//                 {row.student_name || `Student ${index + 1}`}
//               </td>
//               <td className="border px-4 py-2">{row.roll_number || "—"}</td>
//               <td className="border px-4 py-2 font-medium text-blue-600">
//                 {row.marks ?? "—"}
//               </td>
//               <td className="border px-4 py-2">
//                 {/* Use a button to call the download handler */}
//                 <button
//                   onClick={() =>
//                     handleDownload(row.student_id, row.student_name)
//                   }
//                   className="text-blue-600 hover:underline font-medium"
//                   disabled={!row.student_id} // Disable button if no ID exists
//                 >
//                   Download
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default SummaryTable;

// SummaryTable.jsx

// import React from "react";

// const SummaryTable = ({ data }) => {
//   // New function to handle the file download from Base64 data
//   const handleDownload = (base64Pdf, studentId) => {
//     const filename = `${studentId}_report.pdf`;

//     try {
//       // 1. Convert Base64 string to a byte array
//       const byteCharacters = atob(base64Pdf);
//       const byteNumbers = new Array(byteCharacters.length);
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }
//       const byteArray = new Uint8Array(byteNumbers);

//       // 2. Create a Blob (a file-like object) from the byte array
//       const blob = new Blob([byteArray], { type: "application/pdf" });

//       // 3. Create a temporary URL for the Blob
//       const url = window.URL.createObjectURL(blob);

//       // 4. Create a temporary link to trigger the download
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();

//       // 5. Clean up by removing the link and revoking the URL
//       link.parentNode.removeChild(link);
//       window.URL.revokeObjectURL(url);

//     } catch (error) {
//       console.error("Download failed:", error);
//       alert(`Could not generate the report for ${studentId}. The data may be corrupt.`);
//     }
//   };

//   if (!data || data.length === 0) {
//     return (
//       <p className="mt-6 text-center text-gray-500 text-sm">
//         No results to display.
//       </p>
//     );
//   }

//   return (
//     <div className="overflow-x-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
//         📝 Grading Summary
//       </h2>
//       <table className="min-w-full text-sm border border-gray-200 rounded-md overflow-hidden">
//         {/* ... thead ... */}
//         <thead>
//           <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
//             <th className="px-4 py-3 border">Student Name</th>
//             <th className="px-4 py-3 border">Roll Number</th>
//             <th className="px-4 py-3 border">Total Marks</th>
//             <th className="px-4 py-3 border">Report</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, index) => (
//             <tr key={row.student_id || index} className="hover:bg-gray-50">
//               <td className="border px-4 py-2">{row.student_name || `Student ${index + 1}`}</td>
//               <td className="border px-4 py-2">{row.roll_number || "—"}</td>
//               <td className="border px-4 py-2 font-medium text-blue-600">{row.marks ?? "—"}</td>
//               <td className="border px-4 py-2">
//                 <button
//                   onClick={() => handleDownload(row.pdf_base64, row.student_id)}
//                   className="text-blue-600 hover:underline font-medium disabled:text-gray-400 disabled:no-underline"
//                   // Disable the button if there's no PDF data
//                   disabled={!row.pdf_base64}
//                 >
//                   Download
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default SummaryTable;

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
              key={row.student_id || index}
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
                {/* This is a simple, reliable link to the backend download endpoint.
                  The backend will set the correct filename in the response headers.
                */}
                <a
                  href={`http://localhost:8000/api/download/report/${row.student_id}`}
                  className="text-blue-600 hover:underline font-medium"
                  // The 'download' attribute is a hint to the browser to save the file
                  // rather than navigating to it. The actual filename will be set
                  // by the Content-Disposition header from the FastAPI backend.
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
