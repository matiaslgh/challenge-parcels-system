// TODO: Extract types to common place to access from BE and FE

export interface CompanyInput {
  name: string;
}

export interface Company {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
}

export interface Recipient {
  name: string;
  address: Address;
}

export interface ParcelInput {
  recipient: Recipient;
  weight: number;
  value: number;
}

export interface ContainerInput {
  id: string;
  shippingDate: string;
  parcels: ParcelInput[];
}

export interface ContainerDbParsed {
  id: string;
  companyId: string;
  shippingDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContainerDbParsedWithParcels extends ContainerDbParsed {
  parcels: ParcelDbParsed[];
}

export interface ParcelToSave extends ParcelInput {
  sourceDepartment: string | null;
  targetDepartment: string | null;
  companyId: string;
  containerId: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParcelDbParsed extends ParcelToSave {
  id: string;
  createdAt: string;
  updatedAt: string;
}
