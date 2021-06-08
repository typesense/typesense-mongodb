export interface schema {
  name: string;
  fields: field[];
  default_sorting_field?: string;
}

interface field {
  name: string;
  type: string;
  facet?: boolean;
  index?: boolean;
  optional?: boolean;
}
