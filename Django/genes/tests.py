from django.test import TestCase

from django.test import TestCase
from .models import Gene

class GeneModelTest(TestCase): #key functionality test for GC analysis
    def test_gc_content(self):
        gene = Gene(name="TestGene", sequence="ATGCGC")
        self.assertEqual(gene.gc_content(), 50.0)  # 3 G/C out of 6 bases

