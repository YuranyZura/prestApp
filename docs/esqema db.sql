-- TABLA USUARIOS

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  password_hash TEXT,
  document_number VARCHAR(50),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABLA PRÉSTAMOS

CREATE TABLE loans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount NUMERIC(12,2),
  interest_rate NUMERIC(5,2),
  total_amount NUMERIC(12,2),
  status VARCHAR(20),
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABLA PAGOS

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER REFERENCES loans(id),
  amount NUMERIC(12,2),
  payment_method VARCHAR(50),
  transaction_reference VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABLA SCORE

CREATE TABLE risk_scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  score INTEGER,
  level VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABLA DOCUMENTOS

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  document_type VARCHAR(50),
  file_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ÍNDICES

CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_loans_user_id ON loans(user_id);

CREATE INDEX idx_payments_loan_id ON payments(loan_id);

CREATE INDEX idx_scores_user_id ON risk_scores(user_id);