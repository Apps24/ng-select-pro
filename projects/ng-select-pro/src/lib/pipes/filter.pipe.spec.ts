import { FilterPipe } from './filter.pipe';
import { IMultiSelectOption } from '../models/multiselect.models';

const OPTIONS: IMultiSelectOption[] = [
  { id: 1, label: 'Apple' },
  { id: 2, label: 'Banana', group: 'Fruits' },
  { id: 3, label: 'Carrot', group: 'Vegetables' },
  { id: 4, label: 'Date' }
];

describe('FilterPipe', () => {
  let pipe: FilterPipe;

  beforeEach(() => {
    pipe = new FilterPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return all options when query is empty', () => {
    expect(pipe.transform(OPTIONS, '')).toEqual(OPTIONS);
  });

  it('should return all options when query is whitespace', () => {
    expect(pipe.transform(OPTIONS, '   ')).toEqual(OPTIONS);
  });

  it('should filter by label', () => {
    const result = pipe.transform(OPTIONS, 'apple');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
  });

  it('should filter case-insensitively', () => {
    const result = pipe.transform(OPTIONS, 'BANANA');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(2);
  });

  it('should filter by group', () => {
    const result = pipe.transform(OPTIONS, 'vegetables');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(3);
  });

  it('should return empty array when no match', () => {
    expect(pipe.transform(OPTIONS, 'xyz')).toEqual([]);
  });

  it('should handle options with no group (falsy group branch)', () => {
    // 'fruits' matches group of Banana but NOT Apple or Date (no group)
    const result = pipe.transform(OPTIONS, 'fruits');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(2);
  });

  it('should return all options when query is null-like via falsy check', () => {
    expect(pipe.transform(OPTIONS, null as any)).toEqual(OPTIONS);
  });

  it('should handle empty options array', () => {
    expect(pipe.transform([], 'test')).toEqual([]);
  });
});
