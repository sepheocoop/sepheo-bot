import { NocoDBContact, EspoCRMContact } from "./types";

// Helper for concatenating sections into espo's description
const buildDescription = (contact: NocoDBContact): string | undefined => {
    const sections: { title: string; value: string | null }[] = [
        { title: "Introduction", value: contact.Introduction },
        { title: "Provenance", value: contact.Provenance },
        { title: "Connections", value: contact.Connections },
        { title: "Wants", value: contact.Wants },
        { title: "Offers", value: contact.Offers },
    ]

    // Filter out any empty sections
    // Add headings for any non-empty section
    const formattedSections = sections
    .filter(section => section.value?.trim())
    .map(section => `${section.title}\n${section.value}`);

    if (formattedSections.length === 0) return undefined;
    
    // return as a single string
    return formattedSections.join("\n\n\n");
};

const formatEspoDateTime = (dateString: string): string => {
    // Input: '2026-02-26 11:48:12+00:00'
    // Output: '2026-02-26 11:48'
    return dateString.substring(0, 16);
};

export const mapNocoToEspo = (contact: NocoDBContact): EspoCRMContact => {
    return {
        firstName: contact.FirstNames,
        lastName: contact.Surname,
        emailAddress: contact.Email,
        cPhoneNumber: contact.Telephone || undefined,
        cMatrixID: contact.MatrixID || undefined, 
        cWebsite: contact.Website ? [contact.Website] : undefined,
        description: buildDescription(contact),
        cAvailability: contact.Availability || undefined,
        addressCountry: contact.ResidentCountry || undefined,
        addressCity: contact.ResidentLocality || undefined,
        cMembershipAspirations: contact.MembershipAspirations || undefined,
        cCvUrl: contact.CvUrl ? [contact.CvUrl] : undefined,
        cWorkCapacity: contact.Capacity || undefined,
        cJoinedAt: contact.CreatedAt ? formatEspoDateTime(contact.CreatedAt) : undefined,
        cOpenCollectiveID: contact.OpenCollectiveId || undefined,
    }
}