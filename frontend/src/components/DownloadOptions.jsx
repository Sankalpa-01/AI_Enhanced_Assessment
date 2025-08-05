import React from "react";
import { Download, FileText, FileArchive } from "lucide-react";

const DownloadOptions = () => {
  return (
    <div className="mt-10 bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-5">
        <Download className="w-5 h-5 text-blue-600" />
        Download Reports
      </h2>

      <div className="space-y-4 text-sm text-gray-700">
        <a
          href="http://localhost:8000/api/download/all-reports"
          download
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        >
          <FileArchive className="w-4 h-4" />
          <span className="underline underline-offset-2">
            Download All Student Reports (.zip)
          </span>
        </a>

        <a
          href="http://localhost:8000/api/download/summary"
          download
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        >
          <FileText className="w-4 h-4" />
          <span className="underline underline-offset-2">
            Download Summary Table (.csv)
          </span>
        </a>
      </div>
    </div>
  );
};

export default DownloadOptions;
