import { PoolClient } from 'pg';

import { ParcelDb, ParcelDbParsed, ParcelToSave } from './types';
import { parseParcelDb } from './utils';
import { NotFoundError } from '../../common/app-error';
import { generateInsertData } from '../../common/db-utils';
import { pool } from '../../database/connection';

/**
 * Saves the given parcels to the database, if it already exists it gets updated.
 */
export async function saveParcels(parcels: ParcelToSave[], transactionClient: PoolClient): Promise<ParcelDbParsed[]> {
  if (parcels.length === 0) {
    return [];
  }
  const firstParcel = parcels[0];
  const propertyNames = Object.keys(firstParcel).filter(key => !['createdAt', 'updatedAt'].includes(key)) as Array<
    keyof ParcelToSave
  >;

  const { placeholders, values, snakeCasedPropertyNames } = generateInsertData(parcels, propertyNames);

  const columnNames = snakeCasedPropertyNames.join(', ');
  const query = `
    INSERT INTO parcels (${columnNames})
    VALUES ${placeholders} 
    ON CONFLICT (id) DO UPDATE SET 
      ${snakeCasedPropertyNames.map(name => `${name} = EXCLUDED.${name}`).join(', ')}, updated_at = NOW()
    RETURNING *;`;

  const result = await transactionClient.query<ParcelDb>(query, values);
  return result.rows.map(parseParcelDb);
}

export async function getParcels(
  companyId: string,
  containerId: string,
  transactionClient?: PoolClient,
): Promise<ParcelDbParsed[]> {
  const client = transactionClient ?? pool;
  const query = 'SELECT * FROM parcels WHERE company_id = $1 AND container_id = $2;';
  const result = await client.query<ParcelDb>(query, [companyId, containerId]);
  return result.rows.map(parseParcelDb);
}

export async function getParcel(companyId: string, parcelId: string): Promise<ParcelDbParsed> {
  const query = 'SELECT * FROM parcels WHERE company_id = $1 AND id = $2;';
  const result = await pool.query<ParcelDb>(query, [companyId, parcelId]);
  if (result.rowCount === 0) {
    throw new NotFoundError(`Parcel with id ${parcelId} not found in company ${companyId}`);
  }
  return parseParcelDb(result.rows[0]);
}
