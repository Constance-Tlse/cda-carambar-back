const express = require("express");
const router = express.Router();
const { Joke } = require("../sequelize");
const { body, validationResult } = require("express-validator");

/**
 * @openapi
 * /blagues:
 *   get:
 *     summary: Retrieve all jokes
 *     description: Retrieves a list of all jokes available in the database.
 *     tags:
 *       - Jokes
 *     responses:
 *       200:
 *         description: A list of jokes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Joke'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.get("/", async (req, res) => {
 try {
  const jokes = await Joke.findAll();
  res.status(200).json(jokes);
 } catch (error) {
  console.error(error);
  res.status(500).json({ message: error.message });
 }
});

/**
 * @openapi
 * /blagues/random:
 *   get:
 *     summary: Retrieve a random joke
 *     description: Retrieves a single joke chosen randomly from the database.
 *     tags:
 *       - Jokes
 *     responses:
 *       200:
 *         description: A random joke.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Joke'
 *       404:
 *         description: No jokes found or random joke not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not Found"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error."
 */
router.get("/random", async (req, res) => {
 try {
  const allJokes = await Joke.count();
  if (allJokes === 0) {
   return res.status(404).json({ message: "Not Found" });
  }
  const randomIndex = Math.floor(Math.random() * allJokes);

  const joke = await Joke.findOne({
   offset: randomIndex,
   order: [["id", "ASC"]],
  });

  if (!joke) {
   return res.status(404).json({ message: "Not Found" });
  }
  res.status(200).json(joke);
 } catch (error) {
  console.error(error);
  return res.status(500).json({ message: error.message });
 }
});

/**
 * @openapi
 * /blagues/{id}:
 *   get:
 *     summary: Retrieve a joke by its ID
 *     description: Retrieves a specific joke using its unique identifier.
 *     tags:
 *       - Jokes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: The numerical ID of the joke to retrieve.
 *     responses:
 *       200:
 *         description: The corresponding joke.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Joke'
 *       404:
 *         description: Joke not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not Found"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error."
 */
router.get("/:id", async (req, res) => {
 try {
  const jokes = await Joke.findByPk(req.params.id);
  if (!jokes) {
   return res.status(404).json({ message: "Not Found" });
  }
  return res.status(200).json(jokes);
 } catch (error) {
  console.error(error);
  return res.status(500).json({ message: error.message });
 }
});

/**
 * @openapi
 * /blagues/push:
 *   post:
 *     summary: Add a new joke
 *     description: >
 *       Creates a new joke with a question and an answer.
 *       **Validations applied:**
 *       - The `question` and `answer` fields are required and must not be empty.
 *       - Each field must be between 5 and 255 characters long.
 *       - Inputs are sanitized (trimmed and escaped).
 *     tags:
 *       - Jokes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - answer
 *             properties:
 *               question:
 *                 type: string
 *                 description: The joke's question (required, 5-255 chars, not empty, sanitized).
 *                 minLength: 5
 *                 maxLength: 255
 *                 example: "Why do divers always fall backwards off the boat?"
 *               answer:
 *                 type: string
 *                 description: The joke's answer (required, 5-255 chars, not empty, sanitized).
 *                 minLength: 5
 *                 maxLength: 255
 *                 example: "Because if they fell forwards, they'd fall into the boat."
 *     responses:
 *       201:
 *         description: Joke successfully added.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success joke add"
 *                 joke:
 *                   $ref: '#/components/schemas/Joke'
 *       400:
 *         description: Invalid data (empty or out-of-bounds question or answer).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "empty question"
 *                       path:
 *                         type: string
 *                         example: "question"
 *                       location:
 *                         type: string
 *                         example: "body"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error."
 * components:
 *   schemas:
 *     Joke:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: The unique identifier of the joke.
 *           example: 1
 *         question:
 *           type: string
 *           description: The question of the joke.
 *           example: "What does an onion say when it bumps into something?"
 *         answer:
 *           type: string
 *           description: The answer to the joke.
 *           example: "Ouch."
 */
router.post(
 "/push",
 [
  body("question")
   .trim()
   .notEmpty()
   .withMessage("empty question")
   .isLength({ min: 5, max: 255 })
   .withMessage("question needs min 5 characters and 255 characters max")
   .escape(),
  body("answer")
   .trim()
   .notEmpty()
   .withMessage("empty answer.")
   .isLength({ min: 5, max: 255 })
   .withMessage("question needs min 5 characters and 255 characters max")
   .escape(),
 ],
 async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
  }

  try {
   const { question, answer } = req.body;
   const newJoke = await Joke.create({ question, answer });
   return res
    .status(201)
    .json({ message: "Success joke add", joke: newJoke.toJSON() });
  } catch (error) {
   console.error(error);
   return res.status(500).json({ message: error.message });
  }
 },
);

module.exports = router;