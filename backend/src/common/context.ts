import { Request } from 'express';

export interface Context {
  companyId?: string;
}

/**
 * Retrieves the context from the request object.
 *
 * @param req - The request object.
 * @returns The context object.
 * @throws Error if the context is not available in the request object.
 */
export function getContext(req: Request): Context {
  if (req.context === undefined) {
    throw new Error('Context not available');
  }
  return req.context;
}

/**
 * Retrieves the company ID from the request object's context.
 *
 * @param req - The request object.
 * @returns The company ID.
 * @throws Error if the company ID is not available in the context.
 */
export function getCompanyId(req: Request): string {
  const context = getContext(req);
  if (context.companyId === undefined) {
    throw new Error('CompanyId not available');
  }
  return context.companyId;
}
