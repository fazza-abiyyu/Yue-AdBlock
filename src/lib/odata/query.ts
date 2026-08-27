export interface ODataQueryOptions {
  $filter?: string;
  $select?: string;
  $orderby?: string;
  $top?: number;
  $skip?: number;
  $expand?: string;
  $search?: string;
}

export function parseODataQuery(query: Record<string, string>): ODataQueryOptions {
  return {
    $filter: query['$filter'],
    $select: query['$select'],
    $orderby: query['$orderby'],
    $top: query['$top'] ? parseInt(query['$top'], 10) : undefined,
    $skip: query['$skip'] ? parseInt(query['$skip'], 10) : undefined,
    $expand: query['$expand'],
    $search: query['$search'],
  };
}
