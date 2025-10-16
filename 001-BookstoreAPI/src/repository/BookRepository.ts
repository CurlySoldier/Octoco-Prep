// BookRepository.ts  
import { Book } from '../models/Books';
import IBookRepository from './IBookRepository';
import fs from 'fs';
import path from 'path';

export class BookRepository implements IBookRepository {  
  private books: Book[] = [];
  private nextId = 1;
  private filePathRel = './src/Books.json'; // keep a relative string as requested
  private filePath: string; // absolute path used for FS operations

  constructor() {
    // resolve the relative path against the current working directory (keeps the relative string but reliably locates the file)
    this.filePath = path.resolve(process.cwd(), this.filePathRel);

    // ensure parent directory exists for the resolved absolute path
    try {
      fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    } catch {}

    this.loadFromFile();
  }

  private loadFromFile(): void {
    try {
      if (!fs.existsSync(this.filePath)) {
        fs.writeFileSync(this.filePath, '[]', 'utf8');
        this.books = [];
        this.nextId = 1;
        return;
      }

      const raw = fs.readFileSync(this.filePath, 'utf8').trim();
      if (!raw) {
        fs.writeFileSync(this.filePath, '[]', 'utf8');
        this.books = [];
        this.nextId = 1;
        return;
      }

      let parsed: any[] = [];
      try {
        parsed = JSON.parse(raw) as any[];
      } catch (err) {
        // corrupt file: reset to empty array
        fs.writeFileSync(this.filePath, '[]', 'utf8');
        this.books = [];
        this.nextId = 1;
        return;
      }

      // convert createdat strings back to Date objects and guard missing fields
      this.books = parsed.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        genre: b.genre,
        price: b.price,
        createdat: b.createdat ? new Date(b.createdat) : new Date(),
      })) as Book[];

      const maxId = this.books.reduce((max, b) => Math.max(max, b.id ?? 0), 0);
      this.nextId = maxId + 1;
    } catch (err) {
      // if load fails, start with empty store
      this.books = [];
      this.nextId = 1;
      try {
        fs.writeFileSync(this.filePath, '[]', 'utf8');
      } catch {}
    }
  }

  private saveToFile(): void {
    try {
      // Date objects will be stringified to ISO strings
      fs.writeFileSync(this.filePath, JSON.stringify(this.books, null, 2), 'utf8');
    } catch (err) {
      // In a real app, surface/log this error
    }
  }

  create(book: Omit<Book, 'id' | 'createdat'>): Book {  
    const newBook: Book = {  
      id: this.nextId++,  
      createdat: new Date(),  
      ...book,  
    };  
    this.books.push(newBook);
    this.saveToFile();
    return newBook;  
  }  
  
  findById(id: number): Book | undefined {  
    return this.books.find(book => book.id === id);  
  }  
  
  update(id: number, update: Partial<Omit<Book, 'id' | 'createdat'>>): Book | null {  
    const book = this.findById(id);
    if (!book) return null;
    Object.assign(book, update);
    this.saveToFile();
    return book;  
  }  
  
  delete(id: number): boolean {  
    const index = this.books.findIndex(book => book.id === id);
    if (index === -1) return false;
    this.books.splice(index, 1);
    this.saveToFile();
    return true;  
  }  
  
  findByGenre(genre: string): Book[] {  
    if (!genre) return [];
    const target = genre.toString().trim().toLowerCase();
    return this.books.filter(book => {
      const g = (book.genre ?? '').toString().trim().toLowerCase();
      return g === target;
    });
  }  
}
