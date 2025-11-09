// import React from "react";
// import { Download, FileText, FileArchive } from "lucide-react";

// const DownloadOptions = () => {
//   return (
//     <div className="mt-10 bg-white p-6 rounded-2xl shadow-lg">
//       <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-5">
//         <Download className="w-5 h-5 text-blue-600" />
//         Download Reports
//       </h2>

//       <div className="space-y-4 text-sm text-gray-700">
//         <a
//           href="http://localhost:8000/api/download/all-reports"
//           download
//           className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
//         >
//           <FileArchive className="w-4 h-4" />
//           <span className="underline underline-offset-2">
//             Download All Student Reports (.zip)
//           </span>
//         </a>

//         <a
//           href="http://localhost:8000/api/download/summary"
//           download
//           className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
//         >
//           <FileText className="w-4 h-4" />
//           <span className="underline underline-offset-2">
//             Download Summary Table (.csv)
//           </span>
//         </a>
//       </div>
//     </div>
//   );
// };

// export default DownloadOptions;

import React from "react";
import { Download, FileText, FileArchive } from "lucide-react";

const DownloadOptions = () => {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-5">
        <Download className="w-5 h-5 text-blue-600" />
        Download All Reports
      </h2>

      {/* --- NEW Download Cards Layout --- */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Card 1: All Reports ZIP */}
        <a
          href="http://localhost:8000/api/download/all-reports"
          download
          className="group block bg-gray-50 p-5 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileArchive className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 group-hover:text-blue-700">
                Download All Reports
              </p>
              <p className="text-sm text-gray-600">
                Get all individual student reports in a .zip file.
              </p>
            </div>
          </div>
        </a>

        {/* Card 2: Summary CSV */}
        <a
          href="http://localhost:8000/api/download/summary"
          download
          className="group block bg-gray-50 p-5 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 group-hover:text-blue-700">
                Download Summary
              </p>
              <p className="text-sm text-gray-600">
                Get a .csv file of the grading summary table.
              </p>
            </div>
          </div>
        </a>
      </div>
      {/* --- END NEW --- */}
    </div>
  );
};

export default DownloadOptions;
