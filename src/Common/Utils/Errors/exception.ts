import { HttpAppError } from "./app.error.js";

export class ConflictException extends HttpAppError{
     constructor(message = 'Conflict', details :unknown = null) {
        super(message , 409 , 'CONFLICT' ,details as unknown);
        
    }
}

export class NotFoundException extends HttpAppError{
     constructor(message = 'Not found',  details :unknown = null) {
        super(message , 404 , 'NOT_FOUND' ,details as unknown);
        
    }
}

export class BadRequstException extends HttpAppError{
     constructor(message = 'Bad Request', details :unknown = null) {
        super(message , 400 , 'BAD_REQUST' ,details as unknown);
        
    }
}

//internal server error

export class InternalServerErrorException extends HttpAppError{
     constructor(message = 'Internal server error', details :unknown = null) {
        super(message , 500 , 'INTERNAL_SERVER_ERROR' ,details as unknown);
        
    }
}

export class TooManyRequestsException extends HttpAppError{
     constructor(message = 'Too many requests', details :unknown = null) {
        super(message , 429 , 'TOO_MANY_REQUESTS' ,details as unknown);        
    }
}