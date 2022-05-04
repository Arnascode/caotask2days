const express = require('express');
const mysql = require('mysql2/promise');
const { dbConfig } = require('../config');

const petsRoutes = express.Router();

petsRoutes.get('/pets', async (req, res) => {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    const sql = 'SELECT * FROM pets';
    const [rows] = await conn.query(sql);
    res.json(rows);
  } catch (error) {
    console.log('error getting all pets', error);
    res.sendStatus(500);
  } finally {
    await conn?.end();
  }
});

petsRoutes.post('/pets', async (req, res) => {
  let conn;
  try {
    const newPostObj = req.body;
    console.log('newPostObj ===', newPostObj);

    // eslint-disable-next-line object-curly-newline
    const { name, dob, client_email, archived } = newPostObj;

    conn = await mysql.createConnection(dbConfig);
    const sql = `
    INSERT INTO pets (name, dob, client_email, archived)
    VALUES (?, ?, ?, ?)
    `;
    const [insertResultObj] = await conn.execute(sql, [
      name,
      dob,
      client_email,
      archived,
    ]);
    if (insertResultObj.affectedRows === 1) {
      res.status(201).json(insertResultObj);
      return;
    }
    throw new Error('affected row not 1');
  } catch (error) {
    console.log('error creating pets', error);
    res.sendStatus(500);
  } finally {
    await conn?.end();
  }
});

module.exports = petsRoutes;
