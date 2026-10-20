const { nocodb_url, nocodb_table_id, nocodb_api_key } = process.env;

export const getDirectory = async (): Promise<Response | undefined> => {
  if (nocodb_url === undefined) {
    console.error(`No environment variable: nocodb_url`);
    return;
  }
  if (nocodb_api_key === undefined) {
    console.error(`No environment variable: nocodb_api_key`);
    return;
  }

  return fetch(`${nocodb_url}/api/v2/tables/${nocodb_table_id}/records`, {
    headers: {
      "xc-token": nocodb_api_key,
    },
  });
};
