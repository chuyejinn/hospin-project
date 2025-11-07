CREATE TABLE user (
                      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                      email VARCHAR(255),
                      password VARCHAR(255),
                      role ENUM('PATIENT', 'DOCTOR'),
                      birthdate DATE,
                      gender ENUM('MALE', 'FEMALE'),
                      username VARCHAR(255)
);

CREATE TABLE department (
                            id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(255),
                            image_url VARCHAR(255)
);

CREATE TABLE medical_records (
                                 id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                 user_id BIGINT,
                                 department VARCHAR(255),
                                 diagnosis VARCHAR(255),
                                 visit_date DATE,
                                 treatment_fee INT,
                                 FOREIGN KEY (user_id) REFERENCES user(id)
);