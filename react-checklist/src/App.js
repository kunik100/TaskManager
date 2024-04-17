import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css'; // Importujeme CSS soubor

// Komponenta pro zobrazení jednoho úkolu v seznamu
const TaskItem = ({ task, handleToggle, darkMode }) => {
  const creationTime = new Date(task.creationTime).toLocaleString();
  const textColor = darkMode ? '#ddd' : '#333'; // Barva textu odpovídá režimu

  return (
    <tr style={{ color: textColor }}>
      <td>{creationTime}</td>
      <td style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.name}
      </td>
      <td>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
        />
      </td>
    </tr>
  );
};

// Komponenta pro zobrazení seznamu úkolů
const TaskList = ({ tasks, handleToggle, darkMode }) => {
  return (
    <table className="task-table">
      <thead>
        <tr>
          <th>Datum vytvoření</th>
          <th>Název úkolu</th>
          <th>Hotovo</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          <TaskItem
            key={index}
            task={task}
            handleToggle={() => handleToggle(index)}
            darkMode={darkMode}
          />
        ))}
      </tbody>
    </table>
  );
};

// Hlavní komponenta obsahující tlačítka pro přidání a odebrání úkolů
const TaskManager = () => {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const addTask = () => {
    const taskName = prompt('Zadej název úkolu:');
    if (taskName) {
      setTasks([...tasks, { name: taskName, completed: false, creationTime: new Date() }]);
    }
  };

  const removeTask = () => {
    const newTasks = tasks.filter(task => !task.completed);
    setTasks(newTasks);
  };

  const handleToggle = (index) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], completed: !newTasks[index].completed };
    setTasks(newTasks);
  };

  return (
    <div>
      <TaskList tasks={tasks} handleToggle={handleToggle} darkMode={darkMode} />
      <div className="bottom-buttons-container">
        <button className="add-button" onClick={addTask}>Přidat úkol</button>
        <button className="remove-button" onClick={removeTask}>Odebrat úkol</button>
        <button className="toggle-dark-mode" onClick={toggleDarkMode}>
          {darkMode ? 'Denní režim' : 'Noční režim'}
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="day-mode">
        <div className="container">
          <h1>Task Manager</h1>
          <TaskManager />
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
