-- Run this file in psql or pgAdmin to set up your database
-- psql -U postgres -d educore -f schema.sql

-- Users (for auth)
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  role       VARCHAR(20)  NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'teacher', 'student')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Students
CREATE TABLE IF NOT EXISTS students (
  id         SERIAL PRIMARY KEY,
  student_id VARCHAR(20) UNIQUE NOT NULL,
  name       VARCHAR(100) NOT NULL,
  age        INTEGER,
  class      VARCHAR(50),
  gender     VARCHAR(20),
  email      VARCHAR(150),
  status     VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Teachers
CREATE TABLE IF NOT EXISTS teachers (
  id         SERIAL PRIMARY KEY,
  teacher_id VARCHAR(20) UNIQUE NOT NULL,
  name       VARCHAR(100) NOT NULL,
  subject    VARCHAR(100),
  classes    VARCHAR(255),
  email      VARCHAR(150),
  status     VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'On Leave')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Classes
CREATE TABLE IF NOT EXISTS classes (
  id         SERIAL PRIMARY KEY,
  class_id   VARCHAR(20) UNIQUE NOT NULL,
  name       VARCHAR(50) NOT NULL,
  subject    VARCHAR(100),
  teacher    VARCHAR(100),
  students   INTEGER DEFAULT 0,
  room       VARCHAR(50),
  time       VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Grades
CREATE TABLE IF NOT EXISTS grades (
  id           SERIAL PRIMARY KEY,
  grade_id     VARCHAR(20) UNIQUE NOT NULL,
  student      VARCHAR(100) NOT NULL,
  student_id   VARCHAR(20),
  subject      VARCHAR(100),
  score        INTEGER CHECK (score >= 0 AND score <= 100),
  grade        VARCHAR(5),
  term         VARCHAR(20),
  teacher      VARCHAR(100),
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Seed admin user (password: admin123)
INSERT INTO users (name, email, password, role)
VALUES (
  'Admin User',
  'admin@school.edu',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin'
) ON CONFLICT (email) DO NOTHING;