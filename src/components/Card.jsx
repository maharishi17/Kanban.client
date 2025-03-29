import React from "react";
import { FaTrash } from "react-icons/fa";



export const Card = ({ name, description, dueDate, category, _id, deleteTask, onDragStart }) => {
  const isOverdue = new Date(dueDate) < new Date();


{/* Cards Details */}
  return (
    <div
      className="relative flex flex-col gap-2 rounded-lg bg-white p-4 shadow-md"
      draggable
      onDragStart={(e) => onDragStart(e, _id)}
    >

      <p className="text-sm font-medium text-gray-900">{name || "Untitled Task"}</p>
      <p className="text-sm font-medium text-gray-900"> {description}</p>
      <span className={`text-xs ${isOverdue ? "text-red-500" : "text-gray-500"}`}>{dueDate}</span>
      <span className={`rounded-md px-2 py-1 text-xs ${category === "Backend" ? "bg-blue-100 text-blue-600" : category === "UI/UX" ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600"}`}>
        {category}
      </span>


      

      <button onClick={() => deleteTask(_id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
        <FaTrash />
      </button>
    </div>
  );
};
