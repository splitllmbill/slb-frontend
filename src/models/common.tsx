interface FilterField  {
    name: string;
    type:string;
    values?: string[];
  }
  
  interface FilterCriteria  {
    field: string;
    operator: string;
    values: string[];
  }

  interface FilterInput {
    filters:FilterCriteria[];
}