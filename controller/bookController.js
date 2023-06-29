const { query } = require("express")
const pool = require("../db")


const getBook = async (req, res) =>{
  pool.query(
  `SELECT book.book_id, 
  book.book_title, 
  book.isbn_13, 
  book.release_year, 
  book.num_pages, 
  publisher.publisher_name, 
  languages.language_name
  FROM ((book
    INNER JOIN Publisher ON book.publisher_id = Publisher.publisher_id)
    INNER JOIN Languages ON book.language_id = Languages.language_id) 
  ORDER BY book_title ASC`, 
    (error, results)=>{
    if(error) throw error
    res.status(200).json(results.rows)
  })
}

const getBookById = async (req, res) =>{
  const book_id = parseInt(req.params.id)
  pool.query("SELECT * FROM book WHERE book_id = $1", [book_id], (error, results)=>{
    if(error) throw error
    res.status(200).json(results.rows)
  })
}

const addBook = async (req, res) => {
  const { book_title, isbn_13, release_year, num_pages, publisher_name, language_name } = req.body;

  // Memulai koneksi ke database
  const client = await pool.connect();
  try {
    // Memulai transaksi
    await client.query('BEGIN');

    // Cek apakah buku sudah ada dalam database berdasarkan isbn_13
    const result = await client.query('SELECT s FROM book s WHERE s.isbn_13 = $1', [isbn_13]);
    if (result.rows.length) {
      res.send(`Book ${book_title} already exists.`);
      return;
    }

    // Tambahkan buku baru
    await client.query(
      `INSERT INTO book(book_title, isbn_13, release_year, num_pages, publisher_id, language_id)
        VALUES ($1, $2, $3, $4, (SELECT publisher_id FROM publisher p WHERE p.publisher_name = $5),
        (SELECT language_id FROM languages l WHERE l.language_name = $6))`,
      [book_title, isbn_13, release_year, num_pages, publisher_name, language_name]
    );

    // Commit transaksi jika berhasil
    await client.query('COMMIT');
    res.status(201).send(`${book_title} added successfully!`);
  } catch (error) {
    // Rollback transaksi jika terjadi kesalahan
    await client.query('ROLLBACK');
    console.error('Error adding book:', error);
    res.status(500).send('Error adding book');
  } finally {
    // Tutup koneksi database
    client.release();
  }
};


const deleteBook = async (req, res) => {
  const book_id = parseInt(req.params.id);

  // Memulai koneksi ke database
  const client = await pool.connect();
  try {
    // Memulai transaksi
    await client.query('BEGIN');

    // Cek apakah buku ada dalam database
    const result = await client.query('SELECT s FROM book s WHERE s.book_id = $1', [book_id]);
    if (!result.rows.length) {
      res.send('Book Not Found');
      return;
    }

    // Hapus buku
    await client.query('DELETE FROM book WHERE book_id = $1', [book_id]);

    // Commit transaksi jika berhasil
    await client.query('COMMIT');
    res.status(200).send('Book Successfully removed');
  } catch (error) {
    // Rollback transaksi jika terjadi kesalahan
    await client.query('ROLLBACK');
    console.error('Error deleting book:', error);
    res.status(500).send('Error deleting book');
  } finally {
    // Tutup koneksi database
    client.release();
  }
};


const updateBook = async (req, res) => {
  const book_id = parseInt(req.params.id);
  const { book_title, isbn_13, release_year, num_pages, publisher_name, language_name } = req.body;

  // Memulai koneksi ke database
  const client = await pool.connect();
  try {
    // Memulai transaksi
    await client.query('BEGIN');

    // Cek apakah buku ada dalam database
    const result = await client.query('SELECT s FROM book s WHERE s.book_id = $1', [book_id]);
    if (!result.rows.length) {
      res.send('Book Not Found');
      return;
    }

    // Update buku
    await client.query(
      `UPDATE book SET (book_title, isbn_13, release_year, num_pages, publisher_id, language_id)
        = ($1, $2, $3, $4, (SELECT publisher_id FROM publisher p WHERE p.publisher_name = $5), 
        (SELECT language_id FROM languages l WHERE l.language_name = $6))
        WHERE book_id = $7`,
      [book_title, isbn_13, release_year, num_pages, publisher_name, language_name, book_id]
    );

    // Commit transaksi jika berhasil
    await client.query('COMMIT');
    res.status(200).send('Book Successfully updated');
  } catch (error) {
    // Rollback transaksi jika terjadi kesalahan
    await client.query('ROLLBACK');
    console.error('Error updating book:', error);
    res.status(500).send('Error updating book');
  } finally {
    // Tutup koneksi database
    client.release();
  }
};

module.exports = {
  getBook,
  getBookById,
  addBook,
  deleteBook,
  updateBook
}