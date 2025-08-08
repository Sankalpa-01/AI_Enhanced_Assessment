// import React, { useState } from "react";

// const FileUploadForm = ({ onSubmit }) => {
//   const [formData, setFormData] = useState({
//     answerSheets: [],
//     questionPaper: null,
//     answerKey: null,
//     gradingLevel: "Moderate",
//     context: "",
//     reportDetails: "",
//     outputFormat: "PDF",
//   });

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "answerSheets" ? Array.from(files) : files[0],
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-6 bg-gray-200 p-6 sm:p-8 rounded-2xl shadow-lg max-w-3xl mx-auto"
//     >
//       <div className="grid gap-4 sm:grid-cols-2">
//         <div className="sm:col-span-2">
//           <label className="block text-sm font-medium text-black mb-1">
//             Upload Answer Sheets <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="file"
//             name="answerSheets"
//             accept=".pdf,.docx,image/*"
//             multiple
//             required
//             onChange={handleFileChange}
//             className="w-full border border-gray-500 rounded-lg px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//           />
//           {formData.answerSheets.length > 0 && (
//             <ul className="mt-2 space-y-1 text-sm text-gray-600">
//               {formData.answerSheets.map((file, index) => (
//                 <li key={index} className="flex items-center gap-2">
//                   📄 {file.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-black mb-1">
//             Upload Question Paper (optional)
//           </label>
//           <input
//             type="file"
//             name="questionPaper"
//             accept=".pdf,.docx,image/*"
//             onChange={handleFileChange}
//             className="w-full border border-gray-500 rounded-lg px-4 py-2 text-sm"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-black mb-1">
//             Upload Answer Key (optional)
//           </label>
//           <input
//             type="file"
//             name="answerKey"
//             accept=".pdf,.docx,image/*"
//             onChange={handleFileChange}
//             className="w-full border border-gray-500 rounded-lg px-4 py-2 text-sm"
//           />
//         </div>
//       </div>

//       <div className="grid sm:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-black mb-1">
//             Grading Level
//           </label>
//           <select
//             name="gradingLevel"
//             value={formData.gradingLevel}
//             onChange={handleChange}
//             className="w-full border border-gray-500 rounded-lg px-4 py-2 text-sm"
//           >
//             <option value="Strict">Strict</option>
//             <option value="Moderate">Moderate</option>
//             <option value="Lenient">Lenient</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-black mb-1">
//             Output Format
//           </label>
//           <select
//             name="outputFormat"
//             value={formData.outputFormat}
//             onChange={handleChange}
//             className="w-full border border-gray-500 rounded-lg px-4 py-2 text-sm"
//           >
//             <option value="PDF">PDF</option>
//             <option value="Word">Word</option>
//           </select>
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-black mb-1">
//           Additional Grading Context (optional)
//         </label>
//         <textarea
//           name="context"
//           value={formData.context}
//           onChange={handleChange}
//           rows={3}
//           placeholder="e.g., include partial credit if reasoning is correct"
//           className="w-full border border-gray-500 rounded-lg px-4 py-2 text-sm"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-black mb-1">
//           Standard Report Details (optional)
//         </label>
//         <textarea
//           name="reportDetails"
//           value={formData.reportDetails}
//           onChange={handleChange}
//           rows={3}
//           placeholder="e.g., Physics Test | Instructor: Mr. Sharma | Batch A"
//           className="w-full border border-gray-500 rounded-lg px-4 py-2 text-sm"
//         />
//       </div>

//       <div className="pt-4">
//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all"
//         >
//           🚀 Start Grading
//         </button>
//       </div>
//     </form>
//   );
// };

// export default FileUploadForm;

import React, { useState, useRef } from "react";

const FileUploadForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    answerSheets: [],
    questionPaper: null,
    answerKey: null,
    gradingLevel: "Moderate",
    context: "",
    reportDetails: "",
    outputFormat: "PDF",
  });

  const answerSheetsInputRef = useRef();
  const questionPaperInputRef = useRef();
  const answerKeyInputRef = useRef();

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "answerSheets" ? Array.from(files) : files[0],
    }));
  };

  const handleRemoveFile = (name, index = null) => {
    setFormData((prev) => {
      if (name === "answerSheets") {
        const updatedFiles = prev.answerSheets.filter((_, i) => i !== index);
        return { ...prev, answerSheets: updatedFiles };
      }
      return { ...prev, [name]: null };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderFileList = (files, name) =>
    files.length > 0 && (
      <ul className="mt-2 space-y-1 text-sm text-gray-600">
        {files.map((file, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-gray-100 rounded-md px-3 py-2"
          >
            📄 {file.name}
            <button
              type="button"
              onClick={() => handleRemoveFile(name, index)}
              className="text-red-500 text-sm hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-3xl mx-auto border border-gray-300"
    >
      {/* Answer Sheets Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Answer Sheets <span className="text-red-500">*</span>
        </label>
        <div
          onClick={() => answerSheetsInputRef.current.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition"
        >
          <p className="text-blue-600 font-semibold">Upload files</p>
          <p className="text-xs text-gray-500 mt-1">
            PDF, DOCX, PNG, JPG | Multiple files
          </p>
        </div>
        <input
          type="file"
          name="answerSheets"
          ref={answerSheetsInputRef}
          accept=".pdf,.docx,image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        {renderFileList(formData.answerSheets, "answerSheets")}
      </div>

      {/* Question Paper Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Question Paper (optional)
        </label>
        <div
          onClick={() => questionPaperInputRef.current.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition"
        >
          <p className="text-blue-600 font-semibold">Upload file</p>
          <p className="text-xs text-gray-500 mt-1">
            PDF, DOCX, PNG, JPG | Single file
          </p>
        </div>
        <input
          type="file"
          name="questionPaper"
          ref={questionPaperInputRef}
          accept=".pdf,.docx,image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {formData.questionPaper && (
          <div className="mt-2 flex justify-between items-center bg-gray-100 rounded-md px-3 py-2 text-sm">
            📄 {formData.questionPaper.name}
            <button
              type="button"
              onClick={() => handleRemoveFile("questionPaper")}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Answer Key Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Answer Key (optional)
        </label>
        <div
          onClick={() => answerKeyInputRef.current.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition"
        >
          <p className="text-blue-600 font-semibold">Upload file</p>
          <p className="text-xs text-gray-500 mt-1">
            PDF, DOCX, PNG, JPG | Single file
          </p>
        </div>
        <input
          type="file"
          name="answerKey"
          ref={answerKeyInputRef}
          accept=".pdf,.docx,image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {formData.answerKey && (
          <div className="mt-2 flex justify-between items-center bg-gray-100 rounded-md px-3 py-2 text-sm">
            📄 {formData.answerKey.name}
            <button
              type="button"
              onClick={() => handleRemoveFile("answerKey")}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Grading Level and Output Format */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grading Level
          </label>
          <select
            name="gradingLevel"
            value={formData.gradingLevel}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="Strict">Strict</option>
            <option value="Moderate">Moderate</option>
            <option value="Lenient">Lenient</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Output Format
          </label>
          <select
            name="outputFormat"
            value={formData.outputFormat}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="PDF">PDF</option>
            <option value="Word">Word</option>
          </select>
        </div>
      </div>

      {/* Additional Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Grading Context (optional)
        </label>
        <textarea
          name="context"
          value={formData.context}
          onChange={handleChange}
          rows={3}
          placeholder="e.g., include partial credit if reasoning is correct"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Standard Report Details (optional)
        </label>
        <textarea
          name="reportDetails"
          value={formData.reportDetails}
          onChange={handleChange}
          rows={3}
          placeholder="e.g., Physics Test | Instructor: Mr. Sharma | Batch A"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
      >
        🚀 Start Grading
      </button>
    </form>
  );
};

export default FileUploadForm;
