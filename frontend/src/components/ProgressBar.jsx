import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 my-6">
      <div
        className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      />
      <p className="text-sm text-gray-700 mt-1 text-center">
        {progress}% Grading Completed
      </p>
    </div>
  );
};

export default ProgressBar;
