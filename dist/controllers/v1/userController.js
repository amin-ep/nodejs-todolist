import catchAsync from '../../utils/catchAsync.js';
import User from '../../models/User.js';
export default class UserController {
    getAllUsers = catchAsync(async (req, res, next) => {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            data: users,
        });
    });
    getUserById = catchAsync(async (req, res, next) => {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: user,
        });
    });
    updateUser = catchAsync(async (req, res, next) => {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            returnOriginal: false,
        });
        res.status(200).json({
            status: 'success',
            data: updatedUser,
        });
    });
    deleteUser = catchAsync(async (req, res, next) => {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    });
}
