const Joi = require("joi");
const Task = require("../models/task.model");

const taskSchema = Joi.object({
  title: Joi.string().min(2).max(100).required().messages({
    "string.base": `Title should be a text`,
    "string.empty": `Title cannot be empty`,
    "string.min": `Title should have at least 2 characters`,
    "string.max": `Title should not exceed 100 characters`,
    "any.required": `Title is a required field`,
  }),

  description: Joi.string().max(500).allow("").messages({
    "string.base": `Description should be a text`,
    "string.max": `Description should not exceed 500 characters`,
  }),
  completed: Joi.boolean().default(false).messages({
    "boolean.base": `Completed should be a boolean`,
    "any.required": `Completed is a required field`,
  }),
});

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const body = req.body;
    if (!body) {
      return res.status(400).json({ message: "Task data is required" });
    }
    const { error, value } = taskSchema.validate(body);

    if (error)
      return res.status(400).json({ message: error.details[0].message });
    const task = await Task.create(value);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { error, value } = taskSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const task = await Task.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Task ID is required" });
    }
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
