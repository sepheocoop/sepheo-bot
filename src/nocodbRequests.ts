const { nocodb_url, nocodb_table_id, nocodb_api_key } = process.env;

export const getDirectory = () => {
  return fetch(`${nocodb_url}/api/v2/tables/${nocodb_table_id}/records`, {
    headers: {
      "xc-token": nocodb_api_key,
    },
  });
};
