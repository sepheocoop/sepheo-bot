export type ContactEvent = {
  firstName: string;
  event: "create" | "update";
};

type EspoEntry = {
  source?: string;
  event?: "create" | "update";
  contact?: { firstName?: string };
}

export const normalisePayload = (body: unknown): ContactEvent[] => {
  // Espo posts a bare array, batching everything its cron drained into one request.
  const entries: EspoEntry[] = Array.isArray(body) ? body : [];
  const contactEvents: ContactEvent[] = [];

  for (const entry of entries) {
    if (entry?.source !== "ContactPortal") continue;
    if (entry.event !== "create" && entry.event !== "update") {
      console.error(`unknown event type from espo: ${entry.event}`);
      continue;
    }

    contactEvents.push({
      firstName: entry.contact?.firstName ?? "someone",
      event: entry.event,
    });
  }

  return contactEvents;
};