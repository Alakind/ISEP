import unittest
import mysql.connector

class TestMySQLTable(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Set up the database connection
        cls.conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="test",
            unix_socket='/var/run/mysqld/mysqld.sock'
        )
        cls.cursor = cls.conn.cursor()

    @classmethod
    def tearDownClass(cls):
        # Close the database connection
        cls.cursor.close()
        cls.conn.close()

    def test_users_table_exists(self):
        # Check if the Users table exists
        self.cursor.execute("SHOW TABLES LIKE 'Users';")
        result = self.cursor.fetchone()
        self.assertIsNotNone(result, "The Users table does not exist")

    def test_insert_user(self):
        # Insert a new user and check the row count
        self.cursor.execute("INSERT INTO Users (Username, Email) VALUES ('TestUser', 'test.user@example.com');")
        self.conn.commit()

        self.cursor.execute("SELECT COUNT(*) FROM Users WHERE Username = 'TestUser';")
        result = self.cursor.fetchone()
        self.assertEqual(result[0], 1, "Failed to insert TestUser into the Users table")

    def test_unique_email_constraint(self):
        # Attempt to insert a duplicate email and expect an error
        with self.assertRaises(mysql.connector.errors.IntegrityError):
            self.cursor.execute("INSERT INTO Users (Username, Email) VALUES ('AnotherUser', 'john.doe@example.com');")
            self.conn.commit()

    def test_select_user(self):
        # Verify the data for an existing user
        self.cursor.execute("SELECT Username, Email FROM Users WHERE Username = 'JohnDoe';")
        result = self.cursor.fetchone()
        self.assertEqual(result, ('JohnDoe', 'john.doe@example.com'), "The data for JohnDoe is incorrect")

if __name__ == '__main__':
    unittest.main()