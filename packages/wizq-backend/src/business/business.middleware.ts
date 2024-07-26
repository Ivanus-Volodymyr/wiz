import { validateOrReject } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { BusinessDTO } from './dto/business-dto';
import { extractValidationErrors } from '../utils/extractValidationErrors';

export async function validateCreateOrUpdate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const data = new BusinessDTO(req.body);

  try {
    await validateOrReject(data);
  } catch (error: any) {
    const errors = extractValidationErrors(error);

    return res
      .status(400)
      .json({ status: 400, message: errors[0], error: errors[0] });
  }

  next();
}
