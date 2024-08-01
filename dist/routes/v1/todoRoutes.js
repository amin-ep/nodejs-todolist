import { Router } from 'express';
import { protect } from '../../middlewares/globalMiddlewares.js';
import TodoController from '../../controllers/v1/todoController.js';
const router = Router();
const todo = new TodoController();
router.route('/').get(todo.getAllTodos).post(protect, todo.createTodo);
router.get('/getMyTodos', protect, todo.getMyTodos);
export default router;
