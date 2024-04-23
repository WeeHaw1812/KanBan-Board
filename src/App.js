import { useEffect, useState } from "react";
import CreateTask from "./components/CreateTask";
import ListTasks from "./components/ListTasks";
import { Toaster } from "react-hot-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const [tasks, setTasks] = useState([]);

  console.log("tasks", tasks);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    // Kiểm tra nếu storedTasks là null hoặc không phải là một mảng
    if (storedTasks === null || !Array.isArray(storedTasks)) {
      // Nếu là null hoặc không phải mảng, sử dụng một mảng rỗng làm giá trị mặc định
      setTasks([]);
    } else {
      // Nếu là một mảng hợp lệ, cập nhật state tasks
      setTasks(storedTasks);
    }
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster />
      <div className="bg-slate-100 w-screen h-screen">
        <div className="w-screen">
          <ListTasks tasks={tasks} setTasks={setTasks} />
        </div>
        <div className=" w-screen flex">
          <CreateTask
            className="w-1/4"
            tasks={tasks}
            setTasks={setTasks}
            status="todo"
          />
          <CreateTask
            className="w-1/4"
            tasks={tasks}
            setTasks={setTasks}
            status="inprogress"
          />
          <CreateTask
            className="w-1/4"
            tasks={tasks}
            setTasks={setTasks}
            status="done"
          />
          <CreateTask
            className="w-1/4"
            tasks={tasks}
            setTasks={setTasks}
            status="backlog"
          />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
