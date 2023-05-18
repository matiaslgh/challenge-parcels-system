import connection from './connection-data';
export default {
  client: 'pg',
  connection,
  migrations: {
    directory: './migrations',
  },
};
