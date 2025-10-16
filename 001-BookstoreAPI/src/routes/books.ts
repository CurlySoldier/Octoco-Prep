/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         genre:
 *           type: string
 *         price:
 *           type: number
 *         createdat:
 *           type: string
 *           format: date-time
 */
import { Router } from 'express';
import { BookRepository } from '../repository/BookRepository';
import IBookRepository from '../repository/IBookRepository';
import DiscountService from '../services/DiscountService';
import { Book } from '../models/Books';

const repo: IBookRepository = new BookRepository();
const discountService = new DiscountService(repo);
const router = Router();

/**
 * @openapi
 * /books:
 *   post:
 *     summary: Create a new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Book created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Missing required fields
 */
router.post('/', (req, res) => {
  const { title, author, genre, price } = req.body;
  if (!title || !author || !genre || price === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newBook = repo.create({ title, author, genre, price });
  res.status(201).json(newBook);
});

/**
 * @openapi
 * /books/discounted-price:
 *   get:
 *     summary: Calculate total discounted price for a genre
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         required: true
 *         description: Genre to filter books
 *       - in: query
 *         name: discount
 *         schema:
 *           type: number
 *         required: true
 *         description: Discount percentage (0-100)
 *     responses:
 *       200:
 *         description: Discounted price calculated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 genre:
 *                   type: string
 *                 discountPercentage:
 *                   type: number
 *                 totalOriginalPrice:
 *                   type: number
 *                 totalDiscountedPrice:
 *                   type: number
 *       400:
 *         description: Missing or invalid parameters
 *       404:
 *         description: No books found in genre
 */
router.get('/discounted-price', (req, res) => {
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

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
router.get('/:id(\\d+)', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = repo.findById(id);
  if (!book) return res.status(404).json({ error: 'Book not found 1' });
  res.json(book);
});

/**
 * @openapi
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Book updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updateData = req.body as Partial<Omit<Book, 'id' | 'createdat'>>;
  const updatedBook = repo.update(id, updateData);
  if (!updatedBook) return res.status(404).json({ error: 'Book not found' });
  res.json(updatedBook);
});

/**
 * @openapi
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Book ID
 *     responses:
 *       204:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 */
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = repo.delete(id);
  if (!deleted) return res.status(404).json({ error: 'Book not found' });
  res.status(204).send();
});

export default router;
