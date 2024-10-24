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
