import { ContainerDb, ContainerDbParsed, ContainerDbParsedWithParcels, ContainerInput } from './types';
import { NotFoundError } from '../../common/app-error';
import { pool } from '../../database/connection';
import { parseParcelDb, ParcelDb } from '../parcels';

function parseContainerDb(containerFromDb: ContainerDb): ContainerDbParsed {
  return {
    id: containerFromDb.id,
    companyId: containerFromDb.company_id,
    shippingDate: containerFromDb.shipping_date.toISOString(),
    createdAt: containerFromDb.created_at.toISOString(),
    updatedAt: containerFromDb.updated_at.toISOString(),
  };
}

interface ContainerWithParcelsDb extends ContainerDb {
  parcels: ParcelDb[];
}

function parseContainerDbWithParcelsDb(
  containerWithParcelFromDb: ContainerWithParcelsDb,
): ContainerDbParsedWithParcels {
  return {
    ...parseContainerDb(containerWithParcelFromDb),
    parcels: containerWithParcelFromDb.parcels.map(parseParcelDb),
  };
}

/**
 * Saves a container for the specified company.
 * If a container with the given id and company id already exists, it updates it
 */
export async function saveContainer(
  companyId: string,
  containerInput: Omit<ContainerInput, 'parcels'>,
): Promise<ContainerDbParsed> {
  const query = `
    INSERT INTO containers (id, company_id, shipping_date)
    VALUES ($1, $2, $3)
    ON CONFLICT (id, company_id)
    DO UPDATE SET shipping_date = $3, updated_at = NOW()
    RETURNING *;
  `;

  const result = await pool.query<ContainerDb>(query, [containerInput.id, companyId, containerInput.shippingDate]);
  return parseContainerDb(result.rows[0]);
}

/**
 * Builds the SQL query string for retrieving container data based on the provided WHERE clause.
 * @param whereClause The WHERE clause for filtering the container data.
 * @returns The SQL query string.
 */
function buildGetContainerQuery(whereClause: string): string {
  return `
    SELECT 
      containers.id, 
      containers.company_id, 
      containers.shipping_date, 
      containers.created_at, 
      containers.updated_at, 
      COALESCE((
        SELECT json_agg(parcels)
        FROM parcels
        WHERE containers.id = parcels.container_id
        ), '[]'::json) AS parcels
    FROM 
      containers
    LEFT JOIN 
      parcels ON containers.id = parcels.container_id
    WHERE
      ${whereClause}
    GROUP BY 
      containers.id, containers.company_id, containers.shipping_date, containers.created_at, containers.updated_at
    ORDER BY containers.shipping_date DESC;
  `;
}

/**
 * Retrieves all containers for the specified company, including associated parcels.
 */
export async function getContainers(companyId: string): Promise<ContainerDbParsedWithParcels[]> {
  const query = buildGetContainerQuery('containers.company_id = $1');
  const result = await pool.query<ContainerWithParcelsDb>(query, [companyId]);
  return result.rows.map(parseContainerDbWithParcelsDb);
}

/**
 * Retrieves a container with associated parcels for the specified company and container id.
 */
export async function getContainer(companyId: string, containerId: string): Promise<ContainerDbParsedWithParcels> {
  const query = buildGetContainerQuery('containers.company_id = $1 AND containers.id = $2');
  const result = await pool.query<ContainerWithParcelsDb>(query, [companyId, containerId]);
  if (result.rowCount === 0) {
    throw new NotFoundError(`Container ${containerId} not found for company ${companyId}`);
  }
  return parseContainerDbWithParcelsDb(result.rows[0]);
}
