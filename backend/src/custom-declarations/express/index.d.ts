declare namespace Express {
  export interface Request {
    context?: {
      companyId?: string;
    };
  }
}
