const asyncHandler = (requestHandler) => {
  return Promise.resolve(requestHandler(req, res, next)) // Promise method
    .catch((error) => {
      next(error);
    });
};

export { asyncHandler };

/* 
const asyncHandler = (requestHandler) => async (req, res, next) => {
    try {
        await requestHandler(req, res, next);}
    catch (error) {                                                                       // try catch method
    req.status( err.code  ||500);
     success: false,
     message: err.message || 'Internal Server Error'}
        }
*/
