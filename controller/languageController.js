const { query } = require("express")
const pool = require("../db")

const getLanguage = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await pool.query("SELECT * FROM languages ORDER BY language_name ASC");
    const languages = result.rows;
    res.status(200).json(languages);
  } catch (error) {
    console.error("Error occurred while retrieving languages:", error);
    res.status(500).json({ error: "An error occurred while retrieving languages" });
  } finally {
    client.release();
  }
};


const getLanguageById = async (req, res) => {
  const languageId = parseInt(req.params.id);
  const client = await pool.connect();
  try {
    const query = "SELECT * FROM languages WHERE language_id = $1";
    const result = await pool.query(query, [languageId]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Language not found" });
    } else {
      const language = result.rows[0];
      res.status(200).json(language);
    }
  } catch (error) {
    console.error("Error occurred while retrieving language:", error);
    res.status(500).json({ error: "An error occurred while retrieving language" });
  } finally {
    client.release();
  }
};


const addLanguage = async (req, res) => {
  const { language_name } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Memulai transaksi

    const query = "INSERT INTO languages (language_name) VALUES ($1) RETURNING *";
    const result = await client.query(query, [language_name]);
    const addedLanguage = result.rows[0];

    await client.query("COMMIT"); // Melakukan commit transaksi

    res.status(201).json(addedLanguage);
  } catch (error) {
    await client.query("ROLLBACK"); // Melakukan rollback transaksi
    console.error("Error occurred while adding language:", error);
    res.status(500).json({ error: "An error occurred while adding language" });
  } finally {
    client.release();
  }
};


const editLanguage = async (req, res) => {
  const languageId = parseInt(req.params.id);
  const { language_name } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Memulai transaksi

    const checkQuery = "SELECT * FROM languages WHERE language_id = $1";
    const checkResult = await client.query(checkQuery, [languageId]);

    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: "Language not found" });
      return;
    }

    const updateQuery = "UPDATE languages SET language_name = $1 WHERE language_id = $2";
    await client.query(updateQuery, [language_name, languageId]);

    await client.query("COMMIT"); // Melakukan commit transaksi

    res.status(200).json({ message: "Language updated successfully" });
  } catch (error) {
    await client.query("ROLLBACK"); // Melakukan rollback transaksi
    console.error("Error occurred while updating language:", error);
    res.status(500).json({ error: "An error occurred while updating language" });
  } finally {
    client.release();
  }
};


const deleteLanguage = async (req, res) => {
  const languageId = parseInt(req.params.id);
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Memulai transaksi

    const checkQuery = "SELECT * FROM languages WHERE language_id = $1";
    const checkResult = await client.query(checkQuery, [languageId]);

    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: "Language not found" });
      return;
    }

    const deleteQuery = "DELETE FROM languages WHERE language_id = $1";
    await client.query(deleteQuery, [languageId]);

    await client.query("COMMIT"); // Melakukan commit transaksi

    res.status(200).json({ message: "Language deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK"); // Melakukan rollback transaksi
    console.error("Error occurred while deleting language:", error);
    res.status(500).json({ error: "An error occurred while deleting language" });
  } finally {
    client.release();
  }
};


module.exports = {
  getLanguage,
  getLanguageById,
  addLanguage,
  editLanguage,
  deleteLanguage
}