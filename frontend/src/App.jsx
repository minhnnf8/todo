import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const API_URL = "http://127.0.0.1:3000/api/tasks";

function App() {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // GET tasks

  const fetchTasks = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((result) => {
        setTasks(result.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchTasks();
  }, [])

  // POST tasks
  const addTask = () => {
    if (!title.trim()) return;

    fetch(API_URL + "/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title })
    })
      .then(() => {
        setTitle("");
        fetchTasks();
      })
      .catch(console.error);
  };

  // PUT toggle completed
  const toggleTask = (task) => {
    fetch(API_URL + "/" + task.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: task.title,
        isCompleted: !task.isCompleted
      }),
    })
      .then(fetchTasks)
      .catch(console.error)
  };

  // DELETE task
  const deleteTask = (id) => {
    fetch(API_URL + "/" + id, {
      method: "DELETE",
    })
      .then(fetchTasks)
      .catch(console.error);
  };

  return (
    <div style={{padding: 20}}>
      <h2>Task List</h2>
      {/* Add task */}
      <input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='New task...'
      />
      <button onClick={addTask}>Add</button>
      
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input 
              type="checkbox"
              checked={task.isCompleted || false}
              onChange={() => toggleTask(task)}
            />

            <span
              style={{
                textDecoration: task.isCompleted ? "line-through" : "none",
                marginLeft: 8,
              }}
            >
              {task.title}
            </span>

            <button
              style={{ marginLeft: 15 }}
              onClick={() => deleteTask(task.id)}
              >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
