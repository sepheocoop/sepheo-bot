/* 
To-do: Trigger email via espocrm after creating Espo Contact...
*/

import { EspoCRMContact } from "./types";

const { espocrm_api_key, espocrm_url } = process.env;

export const createEspoContact = async (contactData: EspoCRMContact) => {
  if (!espocrm_url || !espocrm_api_key)
    throw new Error("EspoCRM configuration missing");
  if (!contactData) throw new Error("Invalid contact data");

  try {
    const response = await fetch(`http://${espocrm_url}/Contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": espocrm_api_key,
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "EspoCRM fetch failed: ",
        response.status,
        response.statusText,
        errorText,
      );
      throw new Error(
        `EspoCRM response failed with: ${response.statusText} ${response.status}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("EspoCRM fetch failed: ", error);
    throw error;
  }
};
