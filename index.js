const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();
const PORT = 3001;

//middleware
app.use(cors());
app.use(express.json());
//ROUTES

//create a todo, its a post because we are adding data into the database.
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo(description) VALUES($1) RETURNING *", //creating a record
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//get all todos, we use get, because we are getting all data from the database
app.get("/todos", async (req, res) => {
  try {
    const allTodo = await pool.query("SELECT * FROM todo");
    res.json(allTodo.rows);
  } catch (error) {
    console.log(error.messsage);
  }
});

//get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id=$1", [id]);
    res.json(todo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

//update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description =$1 WHERE todo_id=$2",
      [description, id]
    );
    res.json("Todo was updated");
  } catch (error) {
    console.error(error.messasge);
  }
});

//delete a todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id=$1", [
    id,
  ]);
  res.json("Todo was deleted");
});

app.listen(PORT, () => {
  console.log(`Server has started on http://localhost:${PORT}`);
});
