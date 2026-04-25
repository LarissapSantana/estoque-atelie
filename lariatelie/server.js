const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Rota para buscar todos os itens (substitui o carregamento do LocalStorage)
app.get('/estoque', (req, res) => {
    const query = `
        SELECT p.id, p.nome, p.quantidade, c.nome AS categoria 
        FROM produtos p 
        LEFT JOIN categorias c ON p.categoria_id = c.id`;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Rota para adicionar produto
app.post('/estoque', (req, res) => {
    const { nome, quantidade, categoria_id } = req.body;
    const query = 'INSERT INTO produtos (nome, quantidade, categoria_id) VALUES (?, ?, ?)';
    
    db.query(query, [nome, quantidade, categoria_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId, nome, quantidade });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));