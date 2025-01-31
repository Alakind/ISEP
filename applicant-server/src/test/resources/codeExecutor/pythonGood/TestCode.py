import unittest
import Code


class MyTestCase(unittest.TestCase):
    def test_get_five(self):
        self.assertEqual(5, Code.Code.get_five())  # add assertion here


if __name__ == '__main__':
    unittest.main()
