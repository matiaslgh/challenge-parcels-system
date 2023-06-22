export interface BusinessRule {
  id: string;
  name: string;
  sourceDepartment?: string;
  targetDepartment: string;
  minWeight?: number;
  maxWeight?: number;
  minValue?: number;
  maxValue?: number;
}

/**
 * Represents a business rules object from the database.
 */
export interface BusinessRulesDb {
  id: string;
  company_id: string;
  rules: BusinessRule[];
  created_at: Date;
  updated_at: Date;
}

/**
 * Represents a parsed business rules object from the database.
 * Parsed object includes formatted date strings for createdAt and updatedAt fields.
 */
export interface BusinessRulesDbParsed {
  id: string;
  companyId: string;
  rules: BusinessRule[];
  createdAt: string;
  updatedAt: string;
}
