CREATE TABLE Users (
   UserID INT PRIMARY KEY AUTO_INCREMENT,
   Username VARCHAR(50) NOT NULL,
   Email VARCHAR(100) NOT NULL UNIQUE,
   CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Users (Username, Email) VALUES
    ('JohnDone', 'john.doe@example.com'),
    ('JaneSmith', 'jane.smith@example.com');