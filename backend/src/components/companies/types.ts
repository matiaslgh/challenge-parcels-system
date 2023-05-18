/**
 * Represents the input data for creating a company.
 */
export interface CompanyInput {
  name: string;
}

/**
 * Represents the company data stored in the database.
 */
export interface CompanyDb extends CompanyInput {
  id: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Represents the parsed company data retrieved from the database.
 */
export interface CompanyDbParsed extends CompanyInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
