// import React from "react";

// const ProgressBar = ({ progress }) => {
//   return (
//     <div className="w-full bg-gray-200 rounded-full h-4 my-6">
//       <div
//         className="bg-green-500 h-4 rounded-full transition-all duration-300 ease-in-out"
//         style={{ width: `${progress}%` }}
//       />
//       <p className="text-sm text-gray-700 mt-1 text-center">
//         {progress < 100
//           ? `${progress}% Grading Completed`
//           : "✅ Grading Complete"}
//       </p>
//     </div>
//   );
// };

// export default ProgressBar;

// ProgressBar.jsx
import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full my-6">
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-300 ease-out
            ${progress < 100 ? "bg-green-500 animate-pulse" : "bg-green-500"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-700 mt-2 text-center">
        {progress < 100 ? (
          <span>
            <span className="font-bold">{progress}%</span> Grading Completed
          </span>
        ) : (
          <span className="font-bold text-green-600">✅ Grading Complete</span>
        )}
      </p>
    </div>
  );
};

export default ProgressBar;
