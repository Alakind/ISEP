import unittest
import Code


class MyTestCase(unittest.TestCase):
    def test_get_five(self):
        self.assertEqual(5, Code.Code.get_five())


    def test_get_six(self):
        self.assertEqual(6, Code.Code.get_six())


if __name__ == '__main__':
    unittest.main()
