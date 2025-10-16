import { Book } from '../models/Books';

export interface IBookRepository {
  create(book: Omit<Book, 'id' | 'createdat'>): Book;
  findById(id: number): Book | undefined;
  update(id: number, update: Partial<Omit<Book, 'id' | 'createdat'>>): Book | null;
  delete(id: number): boolean;
  findByGenre(genre: string): Book[];
}

export default IBookRepository;
