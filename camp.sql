CREATE DATABASE campusiq;
USE campusiq;
CREATE TABLE departments(

department_id INT AUTO_INCREMENT PRIMARY KEY,

department_name VARCHAR(100) UNIQUE NOT NULL

);
INSERT INTO departments(department_name)

VALUES

('Computer Science Engineering'),

('Information Technology'),

('Artificial Intelligence'),

('Electronics and Communication'),

('Electrical Engineering'),

('Mechanical Engineering'),

('Civil Engineering');
CREATE TABLE students(

student_id INT AUTO_INCREMENT PRIMARY KEY,

register_no VARCHAR(30) UNIQUE,

first_name VARCHAR(100),

last_name VARCHAR(100),

gender ENUM('Male','Female','Other'),

dob DATE,

email VARCHAR(150) UNIQUE,

phone VARCHAR(15),

department_id INT,

cgpa DECIMAL(3,2),

attendance DECIMAL(5,2),

linkedin VARCHAR(255),

github VARCHAR(255),

portfolio VARCHAR(255),

profile_image VARCHAR(255),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP,

FOREIGN KEY(department_id)

REFERENCES departments(department_id)

);
CREATE TABLE certificates(

certificate_id INT AUTO_INCREMENT PRIMARY KEY,

student_id INT,

certificate_name VARCHAR(200),

provider VARCHAR(150),

issue_date DATE,

expiry_date DATE,

certificate_file VARCHAR(255),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(student_id)

REFERENCES students(student_id)

ON DELETE CASCADE

);
CREATE TABLE skills(

skill_id INT AUTO_INCREMENT PRIMARY KEY,

skill_name VARCHAR(100)

);
INSERT INTO skills(skill_name)

VALUES

('Python'),

('SQL'),

('Java'),

('Power BI'),

('Tableau'),

('Excel'),

('Machine Learning'),

('HTML'),

('CSS'),

('JavaScript');
CREATE TABLE student_skills(

id INT AUTO_INCREMENT PRIMARY KEY,

student_id INT,

skill_id INT,

skill_level ENUM(

'Beginner',

'Intermediate',

'Advanced'

),

FOREIGN KEY(student_id)

REFERENCES students(student_id)

ON DELETE CASCADE,

FOREIGN KEY(skill_id)

REFERENCES skills(skill_id)

ON DELETE CASCADE

);
CREATE TABLE projects(

project_id INT AUTO_INCREMENT PRIMARY KEY,

student_id INT,

project_title VARCHAR(200),

description TEXT,

github_link VARCHAR(255),

live_link VARCHAR(255),

project_image VARCHAR(255),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(student_id)

REFERENCES students(student_id)

ON DELETE CASCADE

);
CREATE TABLE resumes(

resume_id INT AUTO_INCREMENT PRIMARY KEY,

student_id INT,

resume_file VARCHAR(255),

ats_score DECIMAL(5,2),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(student_id)

REFERENCES students(student_id)

ON DELETE CASCADE

);
CREATE DATABASE campusiq
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
  SELECT id, full_name, email, is_active
FROM users;
