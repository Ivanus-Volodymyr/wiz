import { ValidationError } from 'class-validator';

export const extractValidationErrors = (errors: ValidationError[]) => {
  const msgs: string[] = [];

  if (Array.isArray(errors)) {
    errors.forEach((err) => {
      if (err.constraints) {
        Object.keys(err.constraints).forEach((key) => {
          msgs.push(err.constraints[key]);
        });
      }
    });
  } else if (typeof errors === 'object' && (errors as any).message) {
    msgs.push((errors as any).message);
  }

  return msgs;
};
