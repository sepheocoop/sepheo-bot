export type member = {
  [key: string]: any;
  Availability: "Not looking" | "Looking";
  FirstNames: string;
  Surname: string;
};

export type directoryResponse = {
  list: member[];
  pageInfo: {
    totalRows: number;
    page: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
  };
};

// Note: excludes Avatar for now
export interface NocoDBContact {
  Id: number;
  CreatedAt: string;
  UpdatedAt: string | null;
  Surname: string;
  FirstNames: string;
  IsActiveMember: string;
  Email: string;
  Telephone: string | null;
  MembershipAspirations: string | null;
  ResidentLocality: string | null;
  ResidentCountry: string | null;
  Website: string | null;
  Introduction: string | null;
  Capacity: string | null;
  CvUrl: string | null;
  CV: string | null;
  Provenance: string | null;
  Connections: string | null;
  Wants: string | null;
  Offers: string | null;
  Availability: string | null;
  LastModifiedBy: string | null;
  MatrixID: string | null;
  JoinedAt: string | null;
  OpenCollectiveId: string | null;
  "Full Name": string | null;
}

/*
Note: 
These are only a subset of fields from our espoCRM "Contact" entity. 
I took the relevant ones

To-do: CV attachments
*/
export interface EspoCRMContact {
  addressCity?: string;
  addressCountry?: string;
  cAvailability?: string;
  cCvUrl?: string[];
  cJoinedAt?: string;
  cMatrixID?: string;
  cPhoneNumber?: string;
  cMembershipAspirations?: string;
  cOpenCollectiveID?: string;
  cWebsite?: string[];
  cWorkCapacity?: string;
  description?: string;
  emailAddress?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phoneNumber?: string;
}
