/**
 * Represents the address information of a recipient.
 */
export interface Address {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
}

/**
 * Represents a recipient of a parcel.
 */
export interface Recipient {
  name: string;
  address: Address;
}

/**
 * Represents the input data for creating a parcel.
 */
export interface ParcelInput {
  recipient: Recipient;
  weight: number;
  value: number;
}

/**
 * Represents the data to save a parcel in the database after processing.
 */
export interface ParcelToSave extends ParcelInput {
  sourceDepartment: string | null;
  targetDepartment: string | null;
  companyId: string;
  containerId: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Represents the parcel data stored in the database.
 */
export interface ParcelDb extends ParcelInput {
  id: string;
  company_id: string;
  container_id: string;
  source_department: string | null;
  target_department: string | null;
  created_at: Date | string; // When got with json_agg it's a string
  updated_at: Date | string; // When got with json_agg it's a string
}

/**
 * Represents the parsed parcel data obtained from the database.
 */
export interface ParcelDbParsed extends ParcelToSave {
  id: string;
  createdAt: string;
  updatedAt: string;
}
