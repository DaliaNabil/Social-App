
export class HttpAppError extends Error {
    constructor(message = 'An error occured',
         public statusCode = 500,
          public code = 'INTERNAL_ERROR ',
           public details :unknown = null)
           
           {
        super(message); 
          Error.captureStackTrace(this, this.constructor);
    }

}