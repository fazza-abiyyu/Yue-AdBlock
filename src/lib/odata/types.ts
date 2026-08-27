export interface ODataMetadata {
  '@odata.context'?: string;
  '@odata.count'?: number;
  '@odata.nextLink'?: string;
  '@odata.deltaLink'?: string;
  '@odata.etag'?: string;
  [key: string]: unknown;
}

export interface ODataCollectionResponse<T> {
  value: T[];
  '@odata.context'?: string;
  '@odata.count'?: number;
  '@odata.nextLink'?: string;
  '@odata.deltaLink'?: string;
  stats?: object;
}

export interface ODataSingleResponse<T> {
  value: T;
  '@odata.context'?: string;
  '@odata.etag'?: string;
}

export interface ODataErrorDetail {
  code: string;
  message: string;
  target?: string;
}

export interface ODataError {
  code: string;
  message: string;
  target?: string;
  details?: ODataErrorDetail[];
  innererror?: unknown;
}

export interface ODataErrorResponse {
  error: ODataError;
}

export type TranslateFn = (code: string, lang: string | undefined, params: { target?: string; defaultMessage: string }) => string;
