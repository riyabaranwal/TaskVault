import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X, Plus, Edit3 } from "lucide-react";
import { gsap } from "gsap";

export default function TaskForm({ onSubmit, editingTask, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const formRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setCompleted(editingTask.completed);
      gsap.fromTo(
        cardRef.current,
        { scale: 1, rotateY: 0 },
        {
          scale: 1.02,
          rotateY: 2,
          duration: 0.3,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        }
      );
    } else {
      setTitle("");
      setDescription("");
      setCompleted(false);
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    gsap.to(formRef.current, {
      scale: 0.98,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        onSubmit({
          title: title.trim(),
          description: description.trim(),
          completed,
        });

        if (!editingTask) {
          setTitle("");
          setDescription("");
          setCompleted(false);
          gsap.fromTo(
            formRef.current,
            { opacity: 0.7 },
            { opacity: 1, duration: 0.3, ease: "power2.out" }
          );
        }
      },
    });
  };

  const handleCancel = () => {
    gsap.to(cardRef.current, {
      x: -10,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        onCancelEdit();
        setTitle("");
        setDescription("");
        setCompleted(false);
      },
    });
  };

  return (
    <Card
      ref={cardRef}
      className="shadow-2xl border border-slate-700/50 bg-slate-800/90 backdrop-blur-sm"
    >
      <CardHeader className="pb-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {editingTask ? (
              <Edit3 className="h-5 w-5 text-purple-400" />
            ) : (
              <Plus className="h-5 w-5 text-blue-400" />
            )}
            <CardTitle className="text-xl font-semibold text-white tracking-tight">
              {editingTask ? "Modify Task" : "Create New Task"}
            </CardTitle>
          </div>
          {editingTask && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="title"
              className="text-sm font-semibold text-slate-200 uppercase tracking-wider"
            >
              Task Title
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive task title..."
              className="border-slate-600/50 bg-slate-700/50 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-lg h-12 text-base font-medium backdrop-blur-sm"
            />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-slate-200 uppercase tracking-wider"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about this task..."
              className="border-slate-600/50 bg-slate-700/50 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-lg min-h-[120px] resize-none text-base leading-relaxed backdrop-blur-sm"
            />
          </div>

          <div className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
            <Checkbox
              id="completed"
              checked={completed}
              onCheckedChange={(checked) => setCompleted(checked)}
              className="border-slate-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 h-5 w-5"
            />
            <Label
              htmlFor="completed"
              className="text-base font-medium text-slate-200 cursor-pointer"
            >
              Mark as completed
            </Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg py-3 font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
            {editingTask && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="px-8 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg py-3 font-semibold transition-all duration-200"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
