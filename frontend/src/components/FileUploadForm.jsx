import React, { useState } from "react";

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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "answerSheets" ? Array.from(files) : files[0],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-200 p-6 sm:p-8 rounded-2xl shadow-lg max-w-3xl mx-auto"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-black mb-1">
            Upload Answer Sheets <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="answerSheets"
            accept=".pdf,.docx,image/*"
            multiple
            required
            onChange={handleFileChange}
            className="w-full border border-gray-500 rounded-lg px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          {formData.answerSheets.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {formData.answerSheets.map((file, index) => (
                <li key={index} className="flex items-center gap-2">
                  📄 {file.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Upload Question Paper (optional)
          </label>
          <input
            type="file"
            name="questionPaper"
            accept=".pdf,.docx,image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-500 rounded-lg px-4 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Upload Answer Key (optional)
          </label>
          <input
            type="file"
            name="answerKey"
            accept=".pdf,.docx,image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-500 rounded-lg px-4 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Grading Level
          </label>
          <select
            name="gradingLevel"
            value={formData.gradingLevel}
            onChange={handleChange}
            className="w-full border border-gray-500 rounded-lg px-4 py-2 text-sm"
          >
            <option value="Strict">Strict</option>
            <option value="Moderate">Moderate</option>
            <option value="Lenient">Lenient</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Output Format
          </label>
          <select
            name="outputFormat"
            value={formData.outputFormat}
            onChange={handleChange}
            className="w-full border border-gray-500 rounded-lg px-4 py-2 text-sm"
          >
            <option value="PDF">PDF</option>
            <option value="Word">Word</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Additional Grading Context (optional)
        </label>
        <textarea
          name="context"
          value={formData.context}
          onChange={handleChange}
          rows={3}
          placeholder="e.g., include partial credit if reasoning is correct"
          className="w-full border border-gray-500 rounded-lg px-4 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Standard Report Details (optional)
        </label>
        <textarea
          name="reportDetails"
          value={formData.reportDetails}
          onChange={handleChange}
          rows={3}
          placeholder="e.g., Physics Test | Instructor: Mr. Sharma | Batch A"
          className="w-full border border-gray-500 rounded-lg px-4 py-2 text-sm"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all"
        >
          🚀 Start Grading
        </button>
      </div>
    </form>
  );
};

export default FileUploadForm;
