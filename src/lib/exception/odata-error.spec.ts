import { describe, expect, test } from 'bun:test';
import { ODataError, ValidationError } from './index.js';

describe('ODataError', () => {
  test('creates error with code, message, and status', () => {
    const err = new ODataError('NOT_FOUND', 'Resource not found', 404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('Resource not found');
    expect(err.status).toBe(404);
    expect(err.name).toBe('ODataError');
    expect(err).toBeInstanceOf(Error);
  });

  test('creates error with lang', () => {
    const err = new ODataError('NOT_FOUND', 'Not found', 404, 'id');
    expect(err.lang).toBe('id');
  });

  test('creates error without lang', () => {
    const err = new ODataError('NOT_FOUND', 'Not found', 404);
    expect(err.lang).toBeUndefined();
  });
});

describe('ValidationError', () => {
  test('creates validation error with status 400', () => {
    const err = new ValidationError('Invalid input');
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.message).toBe('Invalid input');
    expect(err.status).toBe(400);
    expect(err).toBeInstanceOf(ODataError);
    expect(err).toBeInstanceOf(Error);
  });

  test('creates validation error with lang', () => {
    const err = new ValidationError('Input tidak valid', 'id');
    expect(err.lang).toBe('id');
    expect(err.code).toBe('VALIDATION_ERROR');
  });
});
