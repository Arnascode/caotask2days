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

module.exports = petsRoutes;
