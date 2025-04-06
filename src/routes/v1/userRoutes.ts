import { Router } from 'express';
import UserController from '../../controllers/v1/userController.js';
import {
  checkBodyValidation,
  protect,
  restrictTo,
  checkID,
} from '../../middlewares/globalMiddlewares.js';
import { updateUserValidator } from '../../validators/userValidator.js';

const router = Router();

const user = new UserController();

router.use(protect, restrictTo('admin'));

router.param('id', checkID);
router.route('/').get(user.getAllUsers);

router
  .route('/:id')
  .delete(user.deleteUser)
  .patch(checkBodyValidation(updateUserValidator), user.updateUser)
  .get(user.getUserById);

export default router;
