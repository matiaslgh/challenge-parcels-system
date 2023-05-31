import { PoolClient } from 'pg';

import * as dal from './dal';
import { ParcelInput, ParcelToSave, ParcelDbParsed } from './types';
import { InvalidInputError } from '../../common/app-error';
import { executeInTransaction } from '../../common/db-utils';
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
  transactionClient: PoolClient,
): Promise<ParcelDbParsed[]> {
  const businessRules = await getBusinessRules(companyId, transactionClient);

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

  return await dal.saveParcels(parcels, transactionClient);
}

/**
 * Processes the parcels associated with the specified company and container, updating
 * their source and target departments, and saves the updated parcels to the database.
 */
export async function processParcels(companyId: string, containerId: string): Promise<ParcelDbParsed[]> {
  return executeInTransaction(async transactionClient => {
    // Throw NotFoundError if the company does not exist
    await getCompany(companyId, transactionClient);
    // Throw NotFoundError if the container does not exist
    await getContainer(companyId, containerId, transactionClient);

    const businessRules = await getBusinessRules(companyId, transactionClient);
    if (businessRules === null) {
      throw new InvalidInputError(`Cannot process parcels because of missing business rules for company ${companyId}`);
    }

    const parcels = await getParcels(companyId, containerId, transactionClient);
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

    return await dal.saveParcels(updatedParcels, transactionClient);
  });
}

export async function getParcels(
  companyId: string,
  containerId: string,
  transactionClient?: PoolClient,
): Promise<ParcelDbParsed[]> {
  return await dal.getParcels(companyId, containerId, transactionClient);
}

export async function getParcel(companyId: string, parcelId: string): Promise<ParcelDbParsed> {
  return await dal.getParcel(companyId, parcelId);
}
