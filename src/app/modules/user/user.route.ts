import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router
  .route('/profile')
  .get(auth(USER_ROLES.ADMIN, USER_ROLES.DOCTOR,USER_ROLES.HISTOLOGIST,USER_ROLES.HISTOLOGIST,USER_ROLES.PATHOLOGIST), UserController.getUserProfile)
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.ADMIN, USER_ROLES.DOCTOR),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = UserValidation.updateUserZodSchema.parse(
          JSON.parse(req.body.data)
        );
      }
      return UserController.updateProfile(req, res, next);
    }
  );

router
  .route('/')
  .post(
    auth(USER_ROLES.ADMIN,USER_ROLES.REPRESENTATIVE),
    fileUploadHandler(),
    validateRequest(UserValidation.createUserZodSchema),
    UserController.createUser
  );

router.get('/users',auth(),UserController.getAllUsers)
router.get('/doctors',auth(),UserController.getAllDoctors)
router.put('/lock/:userId',auth(USER_ROLES.ADMIN),UserController.lockUnlockedUser)

export const UserRoutes = router;
