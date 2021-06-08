export interface schema {
  name: string;
  fields: field[];
}

interface field {
  name: string;
  type: string;
  facet?: boolean;
  index?: boolean;
  optional?: boolean;
}
