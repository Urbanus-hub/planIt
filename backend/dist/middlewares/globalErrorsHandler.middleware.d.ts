import { Request, Response, NextFunction } from "express";
interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    keyValue?: Record<string, unknown>;
    path?: string;
    value?: unknown;
    status?: number;
    errors?: Record<string, {
        message: string;
    }>;
}
declare const handleGlobalError: (err: CustomError, _req: Request, res: Response, next: NextFunction) => void;
export default handleGlobalError;
//# sourceMappingURL=globalErrorsHandler.middleware.d.ts.map