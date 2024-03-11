import React, { useState, useEffect } from "react";
import "../../styles/index.css";

function Home() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState(""); 
  const username = "miTodoList";
  const apiUrl = `https://playground.4geeks.com/apis/fake/todos/user/${username}`;

  
  useEffect(() => {
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((resp) => {
      if (!resp.ok) throw new Error('Failed to fetch todos');
      return resp.json();
    })
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const formattedTodos = data.map((todo) => ({
          id: todo.id,
          text: todo.label,
          done: todo.done,
        }));
        setTodos(formattedTodos);
      }
    })
    .catch((error) => {
      console.error("Error al cargar los todos:", error);
      fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify([]),
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(resp => resp.json())
      .then(() => console.log("Nuevo usuario creado"))
      .catch(error => console.error("Error creando el usuario:", error));
    });
  }, [apiUrl]); 

  const handleAdd = (e) => {
    e.preventDefault();
    if (!input.trim()) return; 
    const newTodo = { text: input, done: false };
    const newTodos = [...todos, newTodo];
    updateTodos(newTodos);
    setInput(""); 
  };

 
  const handleDelete = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    updateTodos(updatedTodos);
  };

  const handleClearAll = () => {
    fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(() => setTodos([])) 
    .catch(error => console.error("Error al limpiar todos:", error));
  };

  const updateTodos = (newTodos) => {
    fetch(apiUrl, {
      method: "PUT",
      body: JSON.stringify(newTodos.map(todo => ({ label: todo.text, done: todo.done }))),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(resp => resp.json())
    .then(() => setTodos(newTodos)) 
    .catch(error => console.error("Error al actualizar todos:", error));
  };

  return (
    <div className="app">
      <h3 className="titulo-todo">todos</h3>
      <div className="todo-container">
        <form onSubmit={handleAdd}>
          <input
            type="text"
            className="todo-input"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="boton-oculto">Agregar</button>
        </form>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              {todo.text}
              <span className="boton-eliminar" onClick={() => handleDelete(todo.id)}>×</span>
            </li>
          ))}
        </ul>
        <button onClick={handleClearAll} className="limpiar-todos">Limpiar Todos</button>
        <p className="items-restantes">{todos.length} item(s) left</p>
      </div>
    </div>
  );
}

export default Home;
