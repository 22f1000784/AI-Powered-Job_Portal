export const ERROR_CODES = {
  USER_ALREADY_EXISTS: {
    message: "User already exists",
    statusCode: 400,
  },

  UNAUTHORIZED: {
    message: "Unauthorized",
    statusCode: 401,
  },

  NOT_FOUND: {
    message: "Resource not found",
    statusCode: 404,
  },

  REQUIRED_FIELDS_MISSING: {
    message: "Required fields are missing",
    statusCode: 400,
  },

  INVALID_INPUT: {
    message: "Invalid input",
    statusCode: 400,
  },

  INTERNAL_ERROR: {
    message: "Internal server error",
    statusCode: 500,
  },
  ALREADY_APPLIED: {
    message: "You have already applied to this job",
    statusCode: 401,
  },
};