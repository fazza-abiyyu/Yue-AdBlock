import { describe, expect, test } from 'bun:test';
import { ODataResponse } from './response.js';

describe('ODataResponse.collection', () => {
  test('builds a basic collection with value', () => {
    const result = ODataResponse.collection([{ id: 1 }, { id: 2 }]).build();
    expect(result.value).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result['@odata.context']).toBeUndefined();
  });

  test('adds context', () => {
    const result = ODataResponse.collection([{ id: 1 }])
      .context('$metadata#EntitySet')
      .build();
    expect(result['@odata.context']).toBe('$metadata#EntitySet');
  });

  test('adds count', () => {
    const result = ODataResponse.collection([{ id: 1 }])
      .count(100)
      .build();
    expect(result['@odata.count']).toBe(100);
  });

  test('adds nextLink', () => {
    const result = ODataResponse.collection([{ id: 1 }])
      .nextLink('/items?$skip=10')
      .build();
    expect(result['@odata.nextLink']).toBe('/items?$skip=10');
  });

  test('adds deltaLink', () => {
    const result = ODataResponse.collection([{ id: 1 }])
      .deltaLink('/items?$delta')
      .build();
    expect(result['@odata.deltaLink']).toBe('/items?$delta');
  });

  test('adds stats', () => {
    const result = ODataResponse.collection([{ id: 1 }])
      .stats({ total: 1 })
      .build();
    expect(result.stats).toEqual({ total: 1 });
  });

  test('chains multiple builders', () => {
    const result = ODataResponse.collection([{ id: 1 }])
      .context('$metadata#EntitySet')
      .count(1)
      .nextLink('/items?$skip=1')
      .build();
    expect(result['@odata.context']).toBe('$metadata#EntitySet');
    expect(result['@odata.count']).toBe(1);
    expect(result['@odata.nextLink']).toBe('/items?$skip=1');
  });
});

describe('ODataResponse.item', () => {
  test('builds a basic entity with value', () => {
    const result = ODataResponse.item({ id: 1 }).build();
    expect(result.value).toEqual({ id: 1 });
    expect(result['@odata.context']).toBeUndefined();
  });

  test('adds context', () => {
    const result = ODataResponse.item({ id: 1 }).context('$metadata#Entity').build();
    expect(result['@odata.context']).toBe('$metadata#Entity');
  });

  test('adds etag', () => {
    const result = ODataResponse.item({ id: 1 }).etag('W/"1"').build();
    expect(result['@odata.etag']).toBe('W/"1"');
  });

  test('chains context and etag', () => {
    const result = ODataResponse.item({ id: 1 }).context('$metadata#Entity').etag('W/"1"').build();
    expect(result['@odata.context']).toBe('$metadata#Entity');
    expect(result['@odata.etag']).toBe('W/"1"');
  });
});

describe('ODataResponse.created', () => {
  test('builds created entity', () => {
    const result = ODataResponse.created({ id: 1 }).build();
    expect(result.value).toEqual({ id: 1 });
  });
});

describe('ODataResponse.updated', () => {
  test('builds updated entity', () => {
    const result = ODataResponse.updated({ id: 1 }).build();
    expect(result.value).toEqual({ id: 1 });
  });
});

describe('ODataResponse.deleted', () => {
  test('returns null', () => {
    expect(ODataResponse.deleted()).toBeNull();
  });
});

describe('ODataResponse.error', () => {
  test('builds a basic error response', () => {
    const result = ODataResponse.error('NOT_FOUND', 'Resource not found').build();
    expect(result.error.code).toBe('NOT_FOUND');
    expect(result.error.message).toBe('Resource not found');
    expect(result.error.target).toBeUndefined();
    expect(result.error.details).toBeUndefined();
  });

  test('adds target', () => {
    const result = ODataResponse.error('NOT_FOUND', 'Not found').target('/items/1').build();
    expect(result.error.target).toBe('/items/1');
  });

  test('adds details', () => {
    const details = [{ code: 'VALIDATION', message: 'Invalid field' }];
    const result = ODataResponse.error('VALIDATION_ERROR', 'Invalid').details(details).build();
    expect(result.error.details).toEqual(details);
  });

  test('adds innerError', () => {
    const inner = { stack: 'Error at ...' };
    const result = ODataResponse.error('INTERNAL', 'Error').innerError(inner).build();
    expect(result.error.innererror).toBe(inner);
  });

  test('translates message with translateFn', () => {
    const translateFn = (code: string) => `Translated: ${code}`;
    const result = ODataResponse.error('NOT_FOUND', 'Not found')
      .translate(translateFn, 'id')
      .build();
    expect(result.error.message).toBe('Translated: NOT_FOUND');
  });

  test('translates details messages', () => {
    const translateFn = (code: string) => `Translated: ${code}`;
    const details = [{ code: 'FIELD_ERR', message: 'Bad field' }];
    const result = ODataResponse.error('VALIDATION', 'Invalid')
      .details(details)
      .translate(translateFn, 'id')
      .build();
    expect(result.error.details![0].message).toBe('Translated: FIELD_ERR');
  });

  test('falls back to defaultMessage when no translation found', () => {
    const translateFn = (_code: string, _lang: unknown, params: { defaultMessage: string }) =>
      params.defaultMessage;
    const result = ODataResponse.error('UNKNOWN', 'Original message')
      .translate(translateFn, 'fr')
      .build();
    expect(result.error.message).toBe('Original message');
  });
});
