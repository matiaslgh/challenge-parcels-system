import { Pool } from 'pg';

import connection from './connection-data';

const pool = new Pool(connection);

export { pool };
