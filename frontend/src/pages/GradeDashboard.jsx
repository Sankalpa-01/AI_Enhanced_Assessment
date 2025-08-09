// import React, { useState, useEffect } from "react";
// import FileUploadForm from "../components/FileUploadForm";
// import ProgressBar from "../components/ProgressBar";
// import SummaryTable from "../components/SummaryTable";
// import DownloadOptions from "../components/DownloadOptions";

// const GraderDashboard = () => {
//   const [gradingData, setGradingData] = useState(null);
//   const [progress, setProgress] = useState(0);
//   const [isGrading, setIsGrading] = useState(false);
//   const [isGradingComplete, setIsGradingComplete] = useState(false);

//   useEffect(() => {
//     let interval;

//     if (isGrading && progress < 90) {
//       interval = setInterval(() => {
//         setProgress((prev) => Math.min(prev + 5, 90));
//       }, 700); // simulate increment every 300ms
//     }

//     return () => clearInterval(interval);
//   }, [isGrading, progress]);

//   const handleFormSubmit = async (formData) => {
//     const data = new FormData();

//     if (formData.answerSheets && formData.answerSheets.length > 0) {
//       formData.answerSheets.forEach((file) => {
//         if (file instanceof File && file.size > 0) {
//           data.append("answer_sheets", file);
//         }
//       });
//     }

//     if (formData.answerKey instanceof File && formData.answerKey.size > 0) {
//       data.append("answer_key", formData.answerKey);
//     }

//     data.append("grading_level", formData.gradingLevel);
//     data.append("grading_context", formData.context);
//     data.append("report_details", formData.reportDetails);
//     data.append("output_format", formData.outputFormat);

//     try {
//       setIsGrading(true);
//       setIsGradingComplete(false); // Reset completion state
//       setGradingData(null); // Clear old data
//       setProgress(10); // start at 10%

//       // const response = await fetch("http://127.0.0.1:8000/api/grade/", {
//       //   method: "POST",
//       //   body: data,
//       // });

//       // const result = await response.json();
//       // setGradingData(result);

//       const response = await fetch("http://127.0.0.1:8000/api/stream-grade/", {
//         method: "POST",
//         body: data,
//       });

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let buffer = "";

//       setGradingData({ results: [] }); // start empty

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) {
//           setIsGradingComplete(true);
//           break;
//         }

//         buffer += decoder.decode(value, { stream: true });
//         let lines = buffer.split("\n");
//         buffer = lines.pop();

//         for (const line of lines) {
//           if (line.trim()) {
//             const parsed = JSON.parse(line);
//             setGradingData((prev) => ({
//               results: [...(prev.results || []), parsed],
//             }));
//           }
//         }
//       }

//       setProgress(100);
//       setTimeout(() => setIsGrading(false), 1000);
//     } catch (error) {
//       console.error("Grading failed:", error);
//       setProgress(0);
//       setIsGrading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-10 px-4">
//       <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-10 space-y-10">
//         <div className="text-center">
//           <h1 className="text-3xl font-extrabold text-gray-800">
//             🎓 Smart Grader Dashboard
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Upload answer sheets and get AI-powered feedback instantly.
//           </p>
//         </div>

//         <FileUploadForm onSubmit={handleFormSubmit} />

//         {progress > 0 && progress < 100 && (
//           <div className="mt-6">
//             <ProgressBar progress={progress} />
//           </div>
//         )}

//         {gradingData?.results && <SummaryTable data={gradingData.results} />}
//         {isGradingComplete && <DownloadOptions />}
//       </div>
//     </div>
//   );
// };

// export default GraderDashboard;

import React, { useState } from "react";
import FileUploadForm from "../components/FileUploadForm";
import ProgressBar from "../components/ProgressBar";
import SummaryTable from "../components/SummaryTable";
import DownloadOptions from "../components/DownloadOptions";

const GraderDashboard = () => {
  const [gradingData, setGradingData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isGrading, setIsGrading] = useState(false);
  const [isGradingComplete, setIsGradingComplete] = useState(false);

  // The fake progress timer (useEffect) has been removed.

  const handleFormSubmit = async (formData) => {
    // --- 1. Get the total number of files to be graded ---
    const totalFiles = formData.answerSheets.length;
    if (totalFiles === 0) {
      alert("Please select at least one answer sheet.");
      return;
    }

    const data = new FormData();
    formData.answerSheets.forEach((file) => {
      if (file instanceof File && file.size > 0) {
        data.append("answer_sheets", file);
      }
    });
    if (formData.answerKey instanceof File && formData.answerKey.size > 0) {
      data.append("answer_key", formData.answerKey);
    }
    data.append("grading_level", formData.gradingLevel);
    data.append("grading_context", formData.context);
    data.append("report_details", formData.reportDetails);
    data.append("output_format", formData.outputFormat);

    try {
      // Reset state for a new run
      setIsGrading(true);
      setIsGradingComplete(false);
      setGradingData(null);
      setProgress(0); // Start progress at 0

      const response = await fetch("http://127.0.0.1:8000/api/stream-grade/", {
        method: "POST",
        body: data,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      setGradingData({ results: [] });

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setIsGradingComplete(true);
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        let lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (line.trim()) {
            const parsed = JSON.parse(line);

            // --- 2. Update progress based on actual files graded ---
            setGradingData((prev) => {
              const newResults = [...(prev.results || []), parsed];
              // Calculate the new progress percentage
              const newProgress = (newResults.length / totalFiles) * 100;
              // --- FIX: Round the progress to the nearest whole number ---
              setProgress(Math.round(newProgress));
              return { results: newResults };
            });
          }
        }
      }

      // The progress bar will naturally hit 100% as the last item is processed.
      setIsGrading(false);
    } catch (error) {
      console.error("Grading failed:", error);
      setProgress(0);
      setIsGrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-10 space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">
            🎓 Smart Grader Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Upload answer sheets and get AI-powered feedback instantly.
          </p>
        </div>

        <FileUploadForm onSubmit={handleFormSubmit} isGrading={isGrading} />

        {/* Show progress bar only while grading is active */}
        {isGrading && (
          <div className="mt-6">
            <ProgressBar progress={progress} />
          </div>
        )}

        {gradingData?.results && <SummaryTable data={gradingData.results} />}

        {isGradingComplete && <DownloadOptions />}
      </div>
    </div>
  );
};

export default GraderDashboard;
