const errorMiddleWare = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;
    console.error(err);
    //mongoose bad objectId
    if (err.name === "CastError") {
      const message = "resource not found";
      error = new Error(message);
      error.statusCode = 404;
    }
    //mongoose duplicate key error
    if (err.code === 11000) {
      const message = "duplicate filed value entered";
      error = new Error(message);
      error.statusCode = 400;
    }
    // mongoose validation error

    //   {
    //     name: 'ValidationError',
    //     message: 'Validation failed',
    //     errors: {
    //         email: {
    //             kind: 'required',
    //             path: 'email',
    //             value: undefined,
    //             message: 'Path `email` is required.'
    //         },
    //         password: {
    //             kind: 'minlength',
    //             path: 'password',
    //             value: '123',
    //             message: 'Path `password` is shorter than the minimum allowed length (6).'
    //         }
    //     },
    //     // Other properties...
    // }
    if (err.name === "ValidationError") {
      // collect message error
      const message = Object.values(err.errors).map((val) => val.message);

      const error = new Error(message.join(", "));
      error.statusCode = 400;
    }
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "server Error",
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleWare;
