import React, { useState, useEffect } from "react";
import { Column } from "./Column";
import { DragDropContext } from "@hello-pangea/dnd";



// columns details
export const CustomKanban = () => {
  const [columns, setColumns] = useState([
    { id: "todo",  title: "To Do", status: "To Do",cards: [] },
    { id: "inprogress",  title: "In Progress", status: "In Progress",cards: [] },
    { id: "done", title: "Done", status: "Done",cards: [] },
    { id: "add", title: "+ Add Section",isAddSection: true }, 
  ]);



// observe task from db and goes to its columns
  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((tasks) => {
        setColumns((prevColumns) =>
          prevColumns.map((col) =>
            col.isAddSection ? col : { ...col, cards: tasks.filter((task) => task.status === col.status) }
          )
        );
      });
  },  []);



// storing new task to db
  const addTask = (columnId, newTask) => {
    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((savedTask) => {
        setColumns((prevColumns) =>
          prevColumns.map((col) =>
            col.id === columnId ? { ...col, cards: [...col.cards, savedTask] } : col
          )
        );
      });
  };



// del task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, { method: "DELETE" });
  
      if (!response.ok) {
        console.error("Delete failed:", await response.json());
        return;
      }
  
      setColumns((prevColumns) =>
        prevColumns.map((col) => ({
          ...col,
          cards: col.cards ? col.cards.filter((task) => task._id !== taskId) : [],
        }))
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  

// dg and dp functions... gives index.id
  const onDragEnd = (result) => {
    if (!result.destination) return;
  
    const { source, destination, draggableId } = result;
  
    const sourceIndex = columns.findIndex(col => col.id.toString() === source.droppableId);
    const destIndex   = columns.findIndex(col => col.id.toString() === destination.droppableId);
  
    if (sourceIndex === -1 || destIndex === -1) return;
  
    
    const task = columns[sourceIndex].cards.find(task => task._id === draggableId);
    if (!task) return;
  
    setColumns(prev => {
      const newCols = [...prev];
  
    
      newCols[sourceIndex].cards = newCols[sourceIndex].cards.filter(task => task._id !== draggableId);
  
    
      if (!newCols[destIndex].cards.some(t => t._id === draggableId)) {
        newCols[destIndex].cards.push({ ...task, status: newCols[destIndex].status });
      }
  
      return newCols;
    });


  
//update db 
    fetch(`http://localhost:5000/api/tasks/${draggableId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: columns[destIndex].status }),
    });
  };
  
  

// 4th column add
  const addColumn = () => {
    const newColumn = {
      id: Date.now().toString(),
      title: `New Section`,
      status: `New Section`,
      cards: [],
    };
    setColumns([...columns.slice(0, -1), newColumn, columns[columns.length - 1]]); 
  };



// render
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-screen w-full bg-gray-200 p-8 gap-6 overflow-x-auto">


        {columns.map((column) =>


          column.isAddSection ? (
            <button key="add-section" onClick={addColumn} className="bg-blue-500 text-white px-4 py-2 rounded self-start">
              + Add Section
            </button>
          ) : (

            
            <Column
              key={column.id}
              title={column.title}
              cards={column.cards}
              index={column.id}
              
              addTask={addTask}
              deleteTask={deleteTask}
            />
          )
        )}
      </div>
    </DragDropContext>
  );
};
