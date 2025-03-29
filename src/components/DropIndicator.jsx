import React from "react";


// dragged items placed
export const DropIndicator = ({ onDrop }) => {
  return (
    <div
      className="h-2 bg-transparent hover:bg-gray-300 transition-all rounded-md"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    />
  );
};
