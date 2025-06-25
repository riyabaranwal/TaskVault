import { useEffect, useRef, useState } from "react";
import TaskForm from "./components/task-form";
import TaskList from "./components/task-list";
import { createTask, deleteTask, getTasks, updateTask } from "./lib/api";
import { toast } from "sonner";
import gsap from "gsap";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    ).fromTo(
      containerRef.current?.children,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" },
      "-=0.4"
    );
  }, []);

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
        toast.success("Tasks fetched successfully.");
      } catch (error) {
        toast.error("Error fetching tasks.");
      }
    };
    fetchTasks();
  }, []);

  // Create or update task
  const handleSubmit = async (taskData) => {
    if (editingTask) {
      try {
        const updated = await updateTask(editingTask._id, taskData);
        setTasks((prev) =>
          prev.map((task) => (task._id === updated._id ? updated : task))
        );
        toast.success("Task updated successfully.");
        setEditingTask(null);
      } catch (error) {
        toast.error("Failed to update task.");
      }
    } else {
      try {
        const newTask = await createTask(taskData);
        setTasks((prev) => [...prev, newTask]);
        toast.success("Task created successfully.");
      } catch (error) {
        toast.error(
          "Failed to create task:" + error || "Internal Server Error"
        );
      }
    }
  };

  // Handle edit
  const handleEdit = (task) => {
    setEditingTask(task);
  };

  // Delete task
  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully.");
      if (editingTask?._id === taskId) setEditingTask(null);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete task: " + error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={headerRef} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Task Management
          </h1>
          <p className="text-slate-300 text-lg font-medium">
            Streamline your workflow with precision and efficiency
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div ref={containerRef} className="grid lg:grid-cols-2 gap-8">
          <div>
            <TaskForm
              onSubmit={handleSubmit}
              editingTask={editingTask}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          <div>
            <TaskList
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
