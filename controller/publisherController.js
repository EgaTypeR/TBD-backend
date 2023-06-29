const { query } = require("express")
const pool = require("../db")

const getPublisher = async (req, res) => {
  const client = await pool.connect();
  try {
    const query = "SELECT * FROM publisher ORDER BY publisher_name ASC";
    const result = await client.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error occurred while fetching publishers:", error);
    res.status(500).json({ error: "An error occurred while fetching publishers" });
  } finally {
    client.release();
  }
};


const getPublisherById = async (req, res) => {
  const publisherId = parseInt(req.params.publisher_id);
  const client = await pool.connect();
  try {
    const query = "SELECT * FROM publisher WHERE publisher_id = $1";
    const result = await client.query(query, [publisherId]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Publisher not found" });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error occurred while fetching publisher:", error);
    res.status(500).json({ error: "An error occurred while fetching publisher" });
  } finally {
    client.release();
  }
};


const addPublisher = async (req, res) => {
  const { publisher_name } = req.body;
  const client = await pool.connect();
  try {
    const query = "INSERT INTO publisher (publisher_name) VALUES ($1) RETURNING *";
    const values = [publisher_name];
    const result = await client.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error occurred while adding publisher:", error);
    res.status(500).json({ error: "An error occurred while adding publisher" });
  } finally {
    client.release();
  }
};


const editPublisher = async (req, res) => {
  const publisherId = parseInt(req.params.id);
  const { publisher_name } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Memulai transaksi

    const updateQuery = 'UPDATE publisher SET publisher_name = $1 WHERE publisher_id = $2 RETURNING *';
    const updateValues = [publisher_name, publisherId];
    const result = await client.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Publisher not found' });
      return;
    }

    await client.query('COMMIT'); // Commit transaksi

    res.status(200).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaksi
    console.error('Error occurred while editing publisher:', error);
    res.status(500).json({ error: 'An error occurred while editing publisher' });
  } finally {
    client.release();
  }
};


const deletePublisher = async (req, res) => {
  const publisherId = parseInt(req.params.id);
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Memulai transaksi

    const deleteQuery = 'DELETE FROM publisher WHERE publisher_id = $1 RETURNING *';
    const deleteValues = [publisherId];
    const result = await client.query(deleteQuery, deleteValues);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Publisher not found' });
      return;
    }

    await client.query('COMMIT'); // Commit transaksi

    res.status(200).json({ message: 'Publisher deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaksi
    console.error('Error occurred while deleting publisher:', error);
    res.status(500).json({ error: 'An error occurred while deleting publisher' });
  } finally {
    client.release();
  }
};


module.exports = {
  getPublisher,
  getPublisherById,
  addPublisher,
  editPublisher,
  deletePublisher
}