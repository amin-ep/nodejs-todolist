import { Router } from 'express';
import { protect, checkBodyValidation, checkID, setUserOnBody, } from '../../middlewares/globalMiddlewares.js';
import TodoController from '../../controllers/v1/todoController.js';
import { updateTodoValidator, createTodoValidator, } from '../../validators/todoValidator.js';
const router = Router();
const todo = new TodoController();
router.use(protect);
router.param('id', checkID);
router
    .route('/')
    .get(todo.getAllTodos)
    .post(checkBodyValidation(createTodoValidator), setUserOnBody, todo.createTodo);
router.get('/myTodo', todo.getMyTodos);
router
    .route('/:id')
    .patch(checkBodyValidation(updateTodoValidator), todo.updateTodo)
    .delete(todo.deleteTodo)
    .get(todo.getTodoById);
export default router;
