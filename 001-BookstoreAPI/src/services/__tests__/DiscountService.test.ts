import DiscountService from '../DiscountService';
import { Book } from '../../models/Books';
import IBookRepository from '../../repository/IBookRepository';

describe('DiscountService', () => {
  const books: Book[] = [
    { id: 1, title: 'A', author: 'X', genre: 'fantasy', price: 100, createdat: new Date() },
    { id: 2, title: 'B', author: 'Y', genre: 'fantasy', price: 200, createdat: new Date() },
    { id: 3, title: 'C', author: 'Z', genre: 'sci-fi', price: 300, createdat: new Date() },
  ];

  const mockRepo: IBookRepository = {
    create: jest.fn() as any,
    findById: jest.fn() as any,
    update: jest.fn() as any,
    delete: jest.fn() as any,
    findByGenre: jest.fn((genre: string) => books.filter(b => b.genre === genre)),
  };

  const service = new DiscountService(mockRepo);

  test('calculates discounted totals correctly for a genre', () => {
    const result = service.calculateDiscountedTotal('fantasy', 10);
    expect(result.genre).toBe('fantasy');
    expect(result.books.length).toBe(2);
    expect(result.totalOriginalPrice).toBe(300);
    expect(result.totalDiscountedPrice).toBeCloseTo(270);
  });

  test('returns zero totals for empty genre', () => {
    const result = service.calculateDiscountedTotal('nonexistent', 50);
    expect(result.books.length).toBe(0);
    expect(result.totalOriginalPrice).toBe(0);
    expect(result.totalDiscountedPrice).toBe(0);
  });
});
