import IBookRepository from '../repository/IBookRepository';
import { Book } from '../models/Books';

export interface DiscountResult {
  genre: string;
  discountPercentage: number;
  books: Book[];
  totalOriginalPrice: number;
  totalDiscountedPrice: number;
}

export class DiscountService {
  constructor(private repo: IBookRepository) {}

  calculateDiscountedTotal(genre: string, discountPercent: number): DiscountResult {
    const books = this.repo.findByGenre(genre || '');
    const totalOriginalPrice = books.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
    const totalDiscountedPrice = totalOriginalPrice * (1 - discountPercent / 100);

    return {
      genre,
      discountPercentage: discountPercent,
      books,
      totalOriginalPrice,
      totalDiscountedPrice,
    };
  }
}

export default DiscountService;
