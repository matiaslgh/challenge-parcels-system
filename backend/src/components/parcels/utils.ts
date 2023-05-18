import { ParcelDb, ParcelDbParsed } from './types';

export function parseParcelDb(parcelFromDb: ParcelDb): ParcelDbParsed {
  const createdAt =
    typeof parcelFromDb.created_at === 'string' ? parcelFromDb.created_at : parcelFromDb.created_at.toISOString();
  const updatedAt =
    typeof parcelFromDb.updated_at === 'string' ? parcelFromDb.updated_at : parcelFromDb.updated_at.toISOString();
  return {
    id: parcelFromDb.id,
    companyId: parcelFromDb.company_id,
    containerId: parcelFromDb.container_id,
    sourceDepartment: parcelFromDb.source_department,
    targetDepartment: parcelFromDb.target_department,
    recipient: parcelFromDb.recipient,
    weight: parcelFromDb.weight,
    value: parcelFromDb.value,
    createdAt,
    updatedAt,
  };
}
