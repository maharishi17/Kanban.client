import React, { useState } from "react";
import { Card } from "./Card";
import { Droppable, Draggable } from "@hello-pangea/dnd";


// single column details destructing
export const Column = ({ title, cards, index, addTask, deleteTask }) => {

  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    dueDate: "",
    category: "Frontend",
    status: title,
  });



  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };


// each task works
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.name.trim() || !newTask.dueDate.trim()) return;
    addTask(index, { ...newTask, id: Date.now().toString() });
    setNewTask({ name: "", description: "", dueDate: "", category: "Frontend", status: title });
    setIsAdding(false);
  };



  return (
    <div className="w-64 flex-shrink-0 rounded-lg bg-gray-100 p-4">
      <h2 className="mb-3 text-lg font-semibold text-gray-900 flex justify-between">
        {title}
        <button onClick={() => setIsAdding(true)} className="text-blue-500 hover:text-blue-700">+ Add Task</button>
      </h2>



{/* dp functions */}

      <Droppable droppableId={index}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-4">
            {cards.map((card, idx) => (
              <Draggable key={card._id} draggableId={card._id} index={idx}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <Card {...card} deleteTask={deleteTask} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>



{/* +add task */}
      {isAdding && (
        <form onSubmit={handleAddTask} className="mt-3 flex flex-col gap-2">
          <input type="text" name="name" placeholder="Task Name" value={newTask.name} onChange={handleChange} className="w-full p-2 rounded border border-gray-300" />

          <input type="text" name="description" placeholder="Task Description" value={newTask.description} onChange={handleChange} className="w-full p-2 rounded border border-gray-300" />

          <input type="date" name="dueDate" value={newTask.dueDate} onChange={handleChange} className="w-full p-2 rounded border border-gray-300" />

          <select name="category" value={newTask.category} onChange={handleChange} className="w-full p-2 rounded border border-gray-300">
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="UI/UX">UI/UX</option>
          </select>

          
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Add Task</button>
        </form>
      )}
    </div>
  );
};
