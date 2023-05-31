import { PoolClient } from 'pg';

import * as dal from './dal';
import { ContainerDbParsedWithParcels, ContainerInput } from './types';
import { executeInTransaction } from '../../common/db-utils';
import { getCompany } from '../companies';
import { ParcelDbParsed, processAndSaveParcels } from '../parcels';

/**
 * Saves a container with associated parcels for the specified company.
 */
export async function saveContainer(
  companyId: string,
  containerInput: ContainerInput,
): Promise<ContainerDbParsedWithParcels> {
  return executeInTransaction(async transactionClient => {
    // Throws NotFoundError if companyId does not exist
    await getCompany(companyId, transactionClient);
    const { parcels: parcelsInput, ...restContainerInput } = containerInput;
    const container = await dal.saveContainer(companyId, restContainerInput, transactionClient);
    let parcels: ParcelDbParsed[] = [];
    if (parcelsInput.length > 0) {
      parcels = await processAndSaveParcels(companyId, container.id, parcelsInput, transactionClient);
    }
    return { ...container, parcels };
  });
}

export async function getContainers(companyId: string): Promise<ContainerDbParsedWithParcels[]> {
  return await dal.getContainers(companyId);
}

export async function getContainer(
  companyId: string,
  containerId: string,
  transactionClient?: PoolClient,
): Promise<ContainerDbParsedWithParcels> {
  return await dal.getContainer(companyId, containerId, transactionClient);
}
