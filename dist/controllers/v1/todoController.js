import Todo from '../../models/Todo.js';
import catchAsync from '../../utils/catchAsync.js';
import { createTodoValidator } from '../../validators/todoValidator.js';
import HTTPError from '../../utils/httpError.js';
class TodoController {
    getAllTodos = catchAsync(async (req, res, next) => {
        const todos = await Todo.find();
        res.status(200).json({
            status: 'success',
            data: {
                todos,
            },
        });
    });
    createTodo = catchAsync(async (req, res, next) => {
        if (!req.body.user)
            req.body.user = req.user;
        const { error } = createTodoValidator.validate(req.body);
        if (error) {
            return next(new HTTPError(error.message, 400));
        }
        const newTodo = await Todo.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                todo: newTodo,
            },
        });
    });
    updateTodo = catchAsync(async (req, res, next) => {
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            returnOriginal: false,
        });
        res.status(200).json({
            status: 'success',
            data: {
                todo: updatedTodo,
            },
        });
    });
    deleteTodo = catchAsync(async (req, res, next) => {
        await Todo.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    });
    getMyTodos = catchAsync(async (req, res, next) => {
        const myTodos = await Todo.find({ user: req.user });
        res.status(200).json({
            status: 'success',
            result: myTodos.length,
            data: {
                todos: myTodos,
            },
        });
    });
}
export default TodoController;
