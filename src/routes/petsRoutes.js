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

// DELETE /api/posts/:postId - istrina posta kurio id === postId
petsRoutes.delete('/pets/:petsId', async (req, res) => {
  // res.json(req.params.postId);
  let conn;
  try {
    const { petsId } = req.params;
    conn = await mysql.createConnection(dbConfig);
    const sql = 'UPDATE `pets` SET `archived`= 1 WHERE id = ?';
    const [deleteRezult] = await conn.execute(sql, [petsId]);
    if (deleteRezult.affectedRows !== 1) {
      res
        .status(400)
        .json({ success: false, error: `user with id ${petsId}, was not found` });
      return;
    }
    if (deleteRezult.affectedRows === 1) {
      res.json('delete ok');
      return;
    }
    throw new Error('sometnig wrong in deletepets.affectedRows');
  } catch (error) {
    console.log('error DELETE posts', error);
    res.sendStatus(500);
  } finally {
    await conn?.end();
  }
});

module.exports = petsRoutes;
