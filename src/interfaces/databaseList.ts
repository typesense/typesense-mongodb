export interface databaseList {
  databases: database[];
  totalSize: number;
}

interface database {
  name: string;
  sizeOnDist: number;
  empty: boolean;
}
