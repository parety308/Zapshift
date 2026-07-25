import createHttpError from "http-errors";

/**
 * Validates req.body against a Zod schema. On failure, throws a 400 with
 * a flattened, readable message.
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    return next(createHttpError(400, message || "Invalid request data"));
  }
  req.body = result.data;
  next();
};
