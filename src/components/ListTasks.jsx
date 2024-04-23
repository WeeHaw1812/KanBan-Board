import { Delete, DoneAllSharp, MoreHoriz } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import toast from "react-hot-toast";

const ListTasks = ({ tasks, setTasks }) => {
  const [todos, setTodos] = useState([]);
  const [inProgess, setInProgess] = useState([]);
  const [done, setDone] = useState([]);
  const [backlog, setBackLog] = useState([]);

  useEffect(() => {
    const fTodos = tasks.filter((task) => task.status === "todo");
    const fInProgess = tasks.filter((task) => task.status === "inprogress");
    const fDone = tasks.filter((task) => task.status === "done");
    const fBacklog = tasks.filter((task) => task.status === "backlog");

    setTodos(fTodos);
    setInProgess(fInProgess);
    setDone(fDone);
    setBackLog(fBacklog);
  }, [tasks]);

  const statuses = ["todo", "inprogress", "done", "backlog"];
  return (
    <div className="flex">
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todos={todos}
          inProgess={inProgess}
          done={done}
          backlog={backlog}
        />
      ))}
    </div>
  );
};

export default ListTasks;

const Section = ({
  status,
  tasks,
  setTasks,
  todos,
  inProgess,
  done,
  backlog,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => addItemToSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addItemToSection = (id) => {
    setTasks((prev) => {
      const mTasks = prev.map((t) => {
        if (t.id === id) {
          return { ...t, status: status };
        }
        return t;
      });
      localStorage.setItem("tasks", JSON.stringify(mTasks));

      toast("Task status changed", { icon: "🚀" });
      return mTasks;
    });
  };

  let text = "Todo";
  let bg = "bg-blue-300";
  let tasksToMap = todos;

  if (status === "inprogress") {
    text = "In Progess";
    bg = "bg-purple-500";
    tasksToMap = inProgess;
  }

  if (status === "done") {
    text = "Done";
    bg = "bg-green-500";
    tasksToMap = done;
  }

  if (status === "backlog") {
    text = "Back Log";
    bg = "bg-red-500";
    tasksToMap = backlog;
  }

  return (
    <div
      ref={drop}
      className={`w-1/4 p-3 gap-0 ${isOver ? "bg-slate-200" : ""}`}
    >
      <Header text={text} bg={bg} count={tasksToMap.length} />
      {tasksToMap.length > 0 &&
        tasksToMap.map((task) => (
          <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
        ))}
    </div>
  );
};

const Header = ({ text, bg, count }) => {
  return (
    <div
      className={`${bg} flex items-center h-12 px-4 rounded-md text-white justify-between`}
    >
      <div className="flex items-center text-md">
        {text}
        <div
          className="ml-5 bg-white w-5 h-4 text-black
       rounded-full flex items-center justify-center text-xs
      "
        >
          {count}
        </div>
      </div>
      <MoreHoriz />
    </div>
  );
};

const Task = ({ task, tasks, setTasks }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleRemove = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmDelete) {
      const fTasks = tasks.filter((t) => t.id !== id);
      localStorage.setItem("tasks", JSON.stringify(fTasks));
      setTasks(fTasks);
      toast("Task removed", { icon: "🔫" });
    }
  };

  return (
    <div
      ref={drag}
      className=" flex items-center justify-between mt-5 bg-white p-3 cursor-grab"
    >
      <p>{task.name}</p>
      <button>
        <Delete onClick={() => handleRemove(task.id)} />
      </button>
    </div>
  );
};
