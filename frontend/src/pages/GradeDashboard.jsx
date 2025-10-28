// // import React, { useState } from "react";

// // import FileUploadForm from "../components/FileUploadForm";
// // import ProgressBar from "../components/ProgressBar";
// // import SummaryTable from "../components/SummaryTable";
// // import DownloadOptions from "../components/DownloadOptions";

// // const GraderDashboard = () => {
// //   const [gradingData, setGradingData] = useState(null);
// //   const [progress, setProgress] = useState(0);
// //   const [isGrading, setIsGrading] = useState(false);
// //   const [isGradingComplete, setIsGradingComplete] = useState(false);

// //   // The fake progress timer (useEffect) has been removed.

// //   const handleFormSubmit = async (formData) => {
// //     // --- 1. Get the total number of files to be graded ---
// //     const totalFiles = formData.answerSheets.length;
// //     if (totalFiles === 0) {
// //       alert("Please select at least one answer sheet.");
// //       return;
// //     }

// //     const data = new FormData();
// //     formData.answerSheets.forEach((file) => {
// //       if (file instanceof File && file.size > 0) {
// //         data.append("answer_sheets", file);
// //       }
// //     });
// //     if (formData.answerKey instanceof File && formData.answerKey.size > 0) {
// //       data.append("answer_key", formData.answerKey);
// //     }
// //     data.append("grading_level", formData.gradingLevel);
// //     data.append("grading_context", formData.context);
// //     data.append("report_details", formData.reportDetails);
// //     data.append("output_format", formData.outputFormat);

// //     try {
// //       // Reset state for a new run
// //       setIsGrading(true);
// //       setIsGradingComplete(false);
// //       setGradingData(null);
// //       setProgress(0); // Start progress at 0

// //       const response = await fetch("http://127.0.0.1:8000/api/stream-grade/", {
// //         method: "POST",
// //         body: data,
// //       });

// //       const reader = response.body.getReader();
// //       const decoder = new TextDecoder();
// //       let buffer = "";

// //       setGradingData({ results: [] });

// //       while (true) {
// //         const { value, done } = await reader.read();
// //         if (done) {
// //           setIsGradingComplete(true);
// //           break;
// //         }

// //         buffer += decoder.decode(value, { stream: true });
// //         let lines = buffer.split("\n");
// //         buffer = lines.pop();

// //         for (const line of lines) {
// //           if (line.trim()) {
// //             const parsed = JSON.parse(line);

// //             // --- 2. Update progress based on actual files graded ---
// //             setGradingData((prev) => {
// //               const newResults = [...(prev.results || []), parsed];
// //               // Calculate the new progress percentage
// //               const newProgress = (newResults.length / totalFiles) * 100;
// //               // --- FIX: Round the progress to the nearest whole number ---
// //               setProgress(Math.round(newProgress));
// //               return { results: newResults };
// //             });
// //           }
// //         }
// //       }

// //       // The progress bar will naturally hit 100% as the last item is processed.
// //       setIsGrading(false);
// //     } catch (error) {
// //       console.error("Grading failed:", error);
// //       setProgress(0);
// //       setIsGrading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-10 px-4">
// //       <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-10 space-y-10">
// //         <div className="text-center">
// //           <h1 className="text-3xl font-extrabold text-gray-800">
// //             🎓 Smart Grader Dashboard
// //           </h1>
// //           <p className="text-gray-500 text-sm mt-1">
// //             Upload answer sheets and get AI-powered feedback instantly.
// //           </p>
// //         </div>

// //         <FileUploadForm onSubmit={handleFormSubmit} isGrading={isGrading} />

// //         {/* Show progress bar only while grading is active */}
// //         {isGrading && (
// //           <div className="mt-6">
// //             <ProgressBar progress={progress} />
// //           </div>
// //         )}

// //         {gradingData?.results && <SummaryTable data={gradingData.results} />}

// //         {isGradingComplete && <DownloadOptions />}
// //       </div>
// //     </div>
// //   );
// // };

// // export default GraderDashboard;

// // GraderDashboard.jsx
// import React, { useState } from "react";
// import FileUploadForm from "../components/FileUploadForm";
// import ProgressBar from "../components/ProgressBar";
// import SummaryTable from "../components/SummaryTable";
// import DownloadOptions from "../components/DownloadOptions";

// const GraderDashboard = () => {
//   const [gradingData, setGradingData] = useState(null);
//   const [progress, setProgress] = useState(0);
//   const [isGrading, setIsGrading] = useState(false);
//   const [isGradingComplete, setIsGradingComplete] = useState(false);

//   // ... (handleFormSubmit logic remains unchanged) ...
//   const handleFormSubmit = async (formData) => {
//     // --- 1. Get the total number of files to be graded ---
//     const totalFiles = formData.answerSheets.length;
//     if (totalFiles === 0) {
//       alert("Please select at least one answer sheet.");
//       return;
//     }

//     // Check for required files
//     if (!formData.questionPaper) {
//       alert("Please upload the Question Paper.");
//       return;
//     }
//     if (!formData.answerKey) {
//       alert("Please upload the Answer Key.");
//       return;
//     }

//     const data = new FormData();
//     formData.answerSheets.forEach((file) => {
//       if (file instanceof File && file.size > 0) {
//         data.append("answer_sheets", file);
//       }
//     });
//     // Append question paper and answer key
//     data.append("question_paper", formData.questionPaper);
//     data.append("answer_key", formData.answerKey);

//     data.append("grading_level", formData.gradingLevel);
//     data.append("grading_context", formData.context);
//     data.append("report_details", formData.reportDetails);
//     data.append("output_format", formData.outputFormat);

//     try {
//       // Reset state for a new run
//       setIsGrading(true);
//       setIsGradingComplete(false);
//       setGradingData(null);
//       setProgress(0); // Start progress at 0

//       const response = await fetch("http://127.0.0.1:8000/api/stream-grade/", {
//         method: "POST",
//         body: data,
//       });

//       if (!response.ok) {
//         // Handle server errors
//         const errorText = await response.text();
//         throw new Error(`Server error: ${response.status} ${errorText}`);
//       }

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let buffer = "";

//       setGradingData({ results: [] });

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
//             try {
//               const parsed = JSON.parse(line);

//               // --- 2. Update progress based on actual files graded ---
//               setGradingData((prev) => {
//                 const newResults = [...(prev.results || []), parsed];
//                 // Calculate the new progress percentage
//                 const newProgress = (newResults.length / totalFiles) * 100;
//                 // --- FIX: Round the progress to the nearest whole number ---
//                 setProgress(Math.round(newProgress));
//                 return { results: newResults };
//               });
//             } catch (e) {
//               console.warn("Failed to parse JSON line:", line, e);
//             }
//           }
//         }
//       }

//       // The progress bar will naturally hit 100% as the last item is processed.
//       setIsGrading(false);
//     } catch (error) {
//       console.error("Grading failed:", error);
//       alert(`Grading failed: ${error.message}`);
//       setProgress(0);
//       setIsGrading(false);
//       setIsGradingComplete(false); // Ensure results aren't shown on error
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-10 px-4">
//       <div className="max-w-5xl mx-auto space-y-10">
//         {/* --- Card 1: The Form --- */}
//         <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-extrabold text-gray-800">
//               🎓 Smart Grader Dashboard
//             </h1>
//             <p className="text-gray-500 text-sm mt-1">
//               Upload answer sheets and get AI-powered feedback instantly.
//             </p>
//           </div>
//           <FileUploadForm onSubmit={handleFormSubmit} isGrading={isGrading} />
//         </div>

//         {/* --- Section 2: Results (Conditional) --- */}
//         {(isGrading || isGradingComplete || gradingData) && (
//           <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6">
//             {/* Show progress bar only while grading is active */}
//             {isGrading && (
//               <div className="mt-6">
//                 <ProgressBar progress={progress} />
//               </div>
//             )}

//             {/* Show 'Complete' message when done but not actively grading */}
//             {isGradingComplete && !isGrading && (
//               <div className="mt-6">
//                 <ProgressBar progress={100} />
//               </div>
//             )}

//             {gradingData?.results && (
//               <SummaryTable data={gradingData.results} />
//             )}

//             {isGradingComplete && <DownloadOptions />}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GraderDashboard;

// GraderDashboard.jsx
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

  const handleFormSubmit = async (formData) => {
    // --- 1. Get the total number of files to be graded ---
    const totalFiles = formData.answerSheets.length;
    if (totalFiles === 0) {
      alert("Please select at least one answer sheet.");
      return;
    }

    // Check for required files
    if (!formData.questionPaper) {
      alert("Please upload the Question Paper.");
      return;
    }
    if (!formData.answerKey) {
      alert("Please upload the Answer Key.");
      return;
    }

    const data = new FormData();
    formData.answerSheets.forEach((file) => {
      if (file instanceof File && file.size > 0) {
        data.append("answer_sheets", file);
      }
    });
    // Append question paper and answer key
    data.append("question_paper", formData.questionPaper);
    data.append("answer_key", formData.answerKey);

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

      if (!response.ok) {
        // Handle server errors
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${errorText}`);
      }

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
            try {
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
            } catch (e) {
              console.warn("Failed to parse JSON line:", line, e);
            }
          }
        }
      }

      // The progress bar will naturally hit 100% as the last item is processed.
      setIsGrading(false);
    } catch (error) {
      console.error("Grading failed:", error);
      alert(`Grading failed: ${error.message}`);
      setProgress(0);
      setIsGrading(false);
      setIsGradingComplete(false); // Ensure results aren't shown on error
    }
  };

  return (
    // --- MODIFIED: Richer background gradient ---
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* --- Card 1: The Form --- */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800">
              🎓 Smart Grader Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Upload answer sheets and get AI-powered feedback instantly.
            </p>
          </div>
          <FileUploadForm onSubmit={handleFormSubmit} isGrading={isGrading} />
        </div>

        {/* --- Section 2: Results (Conditional) --- */}
        {(isGrading || isGradingComplete || gradingData) && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6">
            {/* Show progress bar only while grading is active */}
            {isGrading && (
              <div className="mt-6">
                <ProgressBar progress={progress} />
              </div>
            )}

            {/* Show 'Complete' message when done but not actively grading */}
            {isGradingComplete && !isGrading && (
              <div className="mt-6">
                <ProgressBar progress={100} />
              </div>
            )}

            {gradingData?.results && (
              <SummaryTable data={gradingData.results} />
            )}

            {isGradingComplete && <DownloadOptions />}
          </div>
        )}
      </div>
    </div>
  );
};

export default GraderDashboard;
