// app.ts  
import express from 'express';  
import { BookRepository } from './repository/BookRepository';  
import IBookRepository from './repository/IBookRepository';
import DiscountService from './services/DiscountService';
import { Book } from './models/Books';  
  
const app = express();  
app.use(express.json());  
  
const repo: IBookRepository = new BookRepository();  
const discountService = new DiscountService(repo);

// --- Create a new book ---  
app.post('/books', (req, res) => {  
  const { title, author, genre, price } = req.body;  
  
  if (!title || !author || !genre || price === undefined) {  
    return res.status(400).json({ error: 'Missing required fields' });  
  }  
  
  const newBook = repo.create({ title, author, genre, price });  
  res.status(201).json(newBook);  
});  
  
// --- Task 2: Calculate total discounted price for a genre ---  
// MOVE THIS: register the literal route before the param route so it won't be captured as :id
app.get('/books/discounted-price', (req, res) => {
  const genre = (req.query.genre as string) || '';
  const discountParam = req.query.discount as string;

  if (!genre || !discountParam) {
    return res.status(400).json({ error: 'Missing genre or discount query parameter' });
  }

  const discount = parseFloat(discountParam);
  if (isNaN(discount) || discount < 0 || discount > 100) {
    return res.status(400).json({ error: 'Discount must be a number between 0 and 100' });
  }

  const result = discountService.calculateDiscountedTotal(genre, discount);
  if (!result || result.books.length === 0) {
    return res.status(404).json({ error: `No books found in genre ${genre}` });
  }

  res.json({
    genre: result.genre,
    discountPercentage: result.discountPercentage,
    totalOriginalPrice: result.totalOriginalPrice,
    totalDiscountedPrice: result.totalDiscountedPrice,
  });
});
  
// --- Get book by ID ---  
// tighten this to only match numeric ids so strings like "discounted-price" cannot match
app.get('/books/:id(\\d+)', (req, res) => {  
  const id = parseInt(req.params.id, 10);
  const book = repo.findById(id);
  if (!book) return res.status(404).json({ error: 'Book not found 1' });
  res.json(book);  
});  
  
// --- Update a book ---  
app.put('/books/:id', (req, res) => {  
  const id = parseInt(req.params.id);  
  const updateData = req.body as Partial<Omit<Book, 'id' | 'createdat'>>;  
  const updatedBook = repo.update(id, updateData);  
  if (!updatedBook) return res.status(404).json({ error: 'Book not found' });  
  res.json(updatedBook);  
});  
  
// --- Delete a book ---  
app.delete('/books/:id', (req, res) => {  
  const id = parseInt(req.params.id);  
  const deleted = repo.delete(id);  
  if (!deleted) return res.status(404).json({ error: 'Book not found' });  
  res.status(204).send();  
});  
  
// Start server  
const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
