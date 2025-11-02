
CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  course VARCHAR(255) NOT NULL
);

-- Sample data
INSERT INTO students (name, email, course) VALUES
('Alice Johnson','alice@hrseinh.com','JavaScript'),
('Bob Smith','bob.smith.com','Python'),
('Charlie Brown','charlie.brown.com','Java'),
('David Lee','david.lee.com','Node js'),
('Eva Green','eva.green.com','C++'),
('Frank Harris','frank.harris.com','C++');
