import * as dal from './dal';
import { ParcelInput, ParcelToSave, ParcelDbParsed } from './types';
import { InvalidInputError } from '../../common/app-error';
import { findDepartment, getBusinessRules } from '../business-rules';
import { getCompany } from '../companies';
import { getContainer } from '../containers';

// TODO: This should be configurable
export const START_DEPARTMENT = 'Distribution center';
export const END_DEPARTMENT = 'Finished';

export async function processAndSaveParcels(
  companyId: string,
  containerId: string,
  parcelsInput: ParcelInput[],
): Promise<ParcelDbParsed[]> {
  const businessRules = await getBusinessRules(companyId);

  // Process and map the parcel inputs to parcel objects with source and target departments
  const parcels: ParcelToSave[] = parcelsInput.map(parcelInput => {
    const parcel: ParcelToSave = {
      ...parcelInput,
      companyId,
      containerId,
      sourceDepartment: START_DEPARTMENT,
      targetDepartment: null,
    };
    return {
      ...parcel,
      targetDepartment: findDepartment(parcel, businessRules?.rules ?? []),
    };
  });

  return await dal.saveParcels(parcels);
}

/**
 * Processes the parcels associated with the specified company and container, updating
 * their source and target departments, and saves the updated parcels to the database.
 */
export async function processParcels(companyId: string, containerId: string): Promise<ParcelDbParsed[]> {
  // Throw NotFoundError if the company does not exist
  await getCompany(companyId);
  // Throw NotFoundError if the container does not exist
  await getContainer(companyId, containerId);

  const businessRules = await getBusinessRules(companyId);
  if (businessRules === null) {
    throw new InvalidInputError(`Cannot process parcels because of missing business rules for company ${companyId}`);
  }

  const parcels = await getParcels(companyId, containerId);
  if (parcels.length === 0) {
    return [];
  }

  const updatedParcels = parcels.map(parcel => {
    const newParcel = {
      ...parcel,
      sourceDepartment: parcel.targetDepartment !== null ? parcel.targetDepartment : parcel.sourceDepartment,
    };

    if (newParcel.sourceDepartment === END_DEPARTMENT) {
      return { ...newParcel, targetDepartment: null };
    }

    return {
      ...newParcel,
      targetDepartment: findDepartment(newParcel, businessRules.rules) ?? END_DEPARTMENT,
    };
  });

  return await dal.saveParcels(updatedParcels);
}

export async function getParcels(companyId: string, containerId: string): Promise<ParcelDbParsed[]> {
  return await dal.getParcels(companyId, containerId);
}

export async function getParcel(companyId: string, parcelId: string): Promise<ParcelDbParsed> {
  return await dal.getParcel(companyId, parcelId);
}
