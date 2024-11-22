const express = require('express');
const mysql = require('mysql2');
const { promisify } = require('util');
const app = express();
const port = 3000;

// Conexão com o banco de dados MySQL
const db = mysql.createPool({
  host: 'db',  
  user: '',
  password: '',  
  database: 'rastreamento',  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


const createDatabaseAndTable = async () => {
  const createDatabaseQuery = 'CREATE DATABASE IF NOT EXISTS rastreamento';
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS pacotes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      numero VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      ultima_localizacao VARCHAR(255) NOT NULL
    );
  `;
  const createData = `
  INSERT INTO pacotes (numero, status, ultima_localizacao) VALUES
('123', 'Em trânsito', 'São Paulo'),
('456', 'Entregue', 'Rio de Janeiro'),
('789', 'Em trânsito', 'Belo Horizonte'),
('101', 'Aguardando retirada', 'Curitiba'),
('202', 'Em trânsito', 'Porto Alegre'),
('303', 'Entregue', 'Salvador'),
('404', 'Em trânsito', 'Brasília'),
('505', 'Em trânsito', 'Fortaleza'),
('606', 'Entregue', 'Manaus'),
('707', 'Em trânsito', 'Recife'),
('808', 'Aguardando retirada', 'Goiânia'),
('909', 'Em trânsito', 'Natal'),
('1001', 'Entregue', 'São Luís'),
('1002', 'Em trânsito', 'Vitoria'),
('1003', 'Em trânsito', 'Florianópolis'),
('1004', 'Entregue', 'Maceió'),
('1005', 'Em trânsito', 'Campo Grande'),
('1006', 'Aguardando retirada', 'João Pessoa'),
('1007', 'Entregue', 'Aracaju'),
('1008', 'Em trânsito', 'Teresina'),
('1009', 'Entregue', 'Cuiabá'),
('1010', 'Em trânsito', 'São Bernardo do Campo'),
('1011', 'Entregue', 'Diadema'),
('1012', 'Em trânsito', 'Osasco'),
('1013', 'Entregue', 'São José dos Campos'),
('1014', 'Em trânsito', 'Ribeirão Preto'),
('1015', 'Aguardando retirada', 'Bauru'),
('1016', 'Em trânsito', 'Santos'),
('1017', 'Entregue', 'Jundiaí'),
('1018', 'Em trânsito', 'Campinas'),
('1019', 'Em trânsito', 'Caxias do Sul'),
('1020', 'Entregue', 'Maringá'),
('1021', 'Em trânsito', 'Uberlândia'),
('1022', 'Entregue', 'Vitória da Conquista'),
('1023', 'Em trânsito', 'Mossoró'),
('1024', 'Aguardando retirada', 'Ponta Grossa'),
('1025', 'Em trânsito', 'Macapá'),
('1026', 'Entregue', 'Boa Vista'),
('1027', 'Em trânsito', 'Canoas'),
('1028', 'Entregue', 'Londrina'),
('1029', 'Em trânsito', 'Petrolina'),
('1030', 'Aguardando retirada', 'Divinópolis'),
('1031', 'Entregue', 'Itajaí'),
('1032', 'Em trânsito', 'Chapecó'),
('1033', 'Entregue', 'Palmas'),
('1034', 'Em trânsito', 'Franca'),
('1035', 'Aguardando retirada', 'Araraquara'),
('1036', 'Em trânsito', 'São Carlos'),
('1037', 'Entregue', 'Belo Horizonte'),
('1038', 'Em trânsito', 'Macapá'),
('1039', 'Entregue', 'Cuiabá'),
('1040', 'Em trânsito', 'Teresina');

`

  try {
    await promisify(db.query).call(db, createDatabaseQuery);
    console.log('Banco de dados "rastreamento" criado ou já existe.');

    await promisify(db.query).call(db, createTableQuery);
    console.log('Tabela "pacotes" criada ou já existe.');

    await promisify(db.query).call(db, createData);
    console.log('Dados inseridos');
  } catch (err) {
    console.error('Erro ao criar banco ou tabela:', err.stack);
  }
};


const connectToDatabase = async () => {
  try {
    await promisify(db.getConnection).call(db);  
    console.log('Conexão com o banco de dados estabelecida.');
    createDatabaseAndTable();  
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
    setTimeout(connectToDatabase, 2000);  
  }
};

connectToDatabase();


app.use(express.json());
app.use(express.static('public')); 


app.get('/api/rastreamento/:numero', (req, res) => {
  const numero = req.params.numero;

  db.execute('SELECT status, ultima_localizacao FROM pacotes WHERE numero = ?', [numero], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao acessar o banco de dados' });
    }

    if (results.length > 0) {
      const pacote = results[0];
      return res.json({ status: pacote.status, ultima_localizacao: pacote.ultima_localizacao });
    } else {
      return res.status(404).json({ message: 'Pacote não encontrado' });
    }
  });
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
