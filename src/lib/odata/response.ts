export interface ODataResponse<T> {
  '@odata.context'?: string;
  value?: T[];
  '@odata.count'?: number;
  item?: T;
  code: number;
  message: string;
}

export function odataCollection<T>(items: T[], count?: number, context?: string): ODataResponse<T> {
  return {
    '@odata.context': context ?? '$metadata#EntitySet',
    value: items,
    '@odata.count': count ?? items.length,
    code: 200,
    message: 'OK',
  };
}

export function odataSingle<T>(item: T, context?: string): ODataResponse<T> {
  return {
    '@odata.context': context ?? '$metadata#EntitySet',
    item,
    code: 200,
    message: 'OK',
  };
}

export function odataError(code: number, message: string): ODataResponse<never> {
  return {
    code,
    message,
  };
}
