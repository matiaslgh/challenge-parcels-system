import { ParcelDbParsed, ParcelInput } from '../parcels';

/**
 * Represents the input data for creating a container.
 */
export interface ContainerInput {
  id: string;
  shippingDate: string;
  parcels: ParcelInput[];
}

/**
 * Represents the container data as stored in the database.
 */
export interface ContainerDb {
  id: string;
  company_id: string;
  shipping_date: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * Represents the parsed container data with dates as strings.
 */
export interface ContainerDbParsed {
  id: string;
  companyId: string;
  shippingDate: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the parsed container data with associated parcels.
 */
export interface ContainerDbParsedWithParcels extends ContainerDbParsed {
  parcels: ParcelDbParsed[];
}
