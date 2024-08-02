"use client";
import React, { useState, useEffect } from 'react';

const Page = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [mainTask, setMainTask] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetch('/api/tasks')
      .then(response => response.json())
      .then(data => setMainTask(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const updateTasksOnServer = (tasks) => {
    fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tasks),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error updating tasks:', error));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    let updatedTasks;
    if (editingIndex !== null) {
      updatedTasks = [...mainTask];
      updatedTasks[editingIndex] = { ...updatedTasks[editingIndex], title, desc };
      setMainTask(updatedTasks);
      setEditingIndex(null);
    } else {
      updatedTasks = [...mainTask, { title, desc, completed: false }];
      setMainTask(updatedTasks);
    }
    updateTasksOnServer(updatedTasks);
    setTitle("");
    setDesc("");
  };

  const deleteHandler = (i) => {
    const updatedTasks = [...mainTask];
    updatedTasks.splice(i, 1);
    setMainTask(updatedTasks);
    updateTasksOnServer(updatedTasks);
  };

  const completeHandler = (i) => {
    const updatedTasks = [...mainTask];
    updatedTasks[i].completed = !updatedTasks[i].completed;
    setMainTask(updatedTasks);
    updateTasksOnServer(updatedTasks);
  };

  const editHandler = (i) => {
    setTitle(mainTask[i].title);
    setDesc(mainTask[i].desc);
    setEditingIndex(i);
  };

  let renderTask = <h2>No task available</h2>;
  if (mainTask.length > 0) {
    renderTask = mainTask.map((t, i) => {
      return (
        <li key={i} className='flex items-center justify-between mb-8'>
          <div className='flex items-center justify-between mb-5 w-2/3'>
            <h5 className={`text-2xl font-semibold ${t.completed ? 'line-through' : ''}`}>{t.title}</h5>
            <h5 className={`text-lg font-medium ${t.completed ? 'line-through' : ''}`}>{t.desc}</h5>
          </div>
          <button 
            onClick={() => completeHandler(i)}
            className='bg-green-400 text-white px-4 py-2 rounded'>
            {t.completed ? 'Undo' : 'Complete'}
          </button>
          <button 
            onClick={() => editHandler(i)}
            className='bg-blue-400 text-white px-4 py-2 rounded'>
            Edit 
          </button>
          <button 
            onClick={() => deleteHandler(i)}
            className='bg-red-400 text-white px-4 py-2 rounded'>
            Delete
          </button>
        </li> 
      );
    });
  }

  return (
    <> 
      <h1 className='bg-black text-white p-5 text-5xl font-bold text-center'>Priya's Todo list</h1>
      <form onSubmit={submitHandler}>
        <input
          type='text'
          className='text-2xl border-zinc-800 border-2 m-5 px-4 py-2'
          placeholder='Enter Task Here'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type='text'
          className='text-2xl border-zinc-800 border-2 m-5 px-4 py-2'
          placeholder='Enter Description Here'
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button className='bg-black text-white px-4 py-3 text-2xl font-bold rounded m-5'> 
          {editingIndex !== null ? 'Update Task' : 'Add Task'}
        </button>
      </form>
      <hr/>
      <div className='p-8 bg-slate-200 m-10'>
        <ul>
          {renderTask}
        </ul>
      </div>
    </>
  );
};

export default Page;
