import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Edit2,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  FolderOpen,
} from "lucide-react";
import { gsap } from "gsap";
import { formatDistanceToNow } from "date-fns";

export default function TaskList({ tasks, onEdit, onDelete }) {
  const listRef = useRef(null);
  const emptyStateRef = useRef(null);

  useEffect(() => {
    if (tasks.length > 0 && listRef.current) {
      const taskElements = listRef.current.children;
      gsap.fromTo(
        Array.from(taskElements).slice(-1),
        { opacity: 0, x: 50, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [tasks.length]);

  const handleEdit = (task) => {
    onEdit(task);
  };

  const handleDelete = (taskId, element) => {
    gsap.to(element, {
      x: -100,
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => onDelete(taskId),
    });
  };

  if (tasks.length === 0) {
    return (
      <Card className="shadow-2xl border border-slate-700/50 bg-slate-800/90 backdrop-blur-sm">
        <CardContent className="py-16">
          <div ref={emptyStateRef} className="text-center">
            <FolderOpen className="mx-auto h-16 w-16 text-slate-500 mb-6" />
            <h3 className="text-xl font-semibold text-white mb-3">
              No Tasks Available
            </h3>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm mx-auto">
              Begin your productivity journey by creating your first task. Stay
              organized and achieve your goals.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Task Overview
        </h2>
        <Badge className="bg-slate-700/50 text-slate-200 border-slate-600/50 px-3 py-1 text-sm font-semibold">
          {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}
        </Badge>
      </div>

      <div ref={listRef} className="space-y-4">
        {tasks.map((task, index) => (
          <Card
            key={index}
            className="shadow-lg border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 bg-slate-800/90 backdrop-blur-sm hover:shadow-xl group"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-3">
                    {task.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="h-6 w-6 text-slate-400 flex-shrink-0" />
                    )}
                    <h3
                      className={`font-semibold text-lg truncate ${
                        task.completed
                          ? "line-through text-slate-500"
                          : "text-white"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <Badge
                      variant={task.completed ? "secondary" : "default"}
                      className={`text-xs font-semibold px-3 py-1 ${
                        task.completed
                          ? "bg-green-900/50 text-green-300 border-green-800/50"
                          : "bg-blue-900/50 text-blue-300 border-blue-800/50"
                      }`}
                    >
                      {task.completed ? "Completed" : "In Progress"}
                    </Badge>
                  </div>

                  {task.description && (
                    <p
                      className={`text-base leading-relaxed mb-3 ${
                        task.completed
                          ? "line-through text-slate-500"
                          : "text-slate-300"
                      }`}
                    >
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Updated at{" "}
                      {formatDistanceToNow(new Date(task.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(task)}
                    className="h-10 w-10 p-0 hover:bg-blue-900/50 hover:text-blue-300 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4 text-white" />
                    <span className="sr-only">Edit task</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) =>
                      handleDelete(task._id, e.currentTarget.closest(".group"))
                    }
                    className="h-10 w-10 p-0 hover:bg-red-900/50 hover:text-red-300 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Delete task</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
