from django.db import models

class Gene(models.Model):
    name = models.CharField(max_length=100)  # Field for gene name
    sequence = models.TextField()  # Field for the nucleotide sequence
    uploaded_file = models.FileField(upload_to='uploads/', null=True, blank=True)  

    def gc_content(self):
        """Calculate GC content percentage."""
        if not self.sequence:
            return 0
        g_count = self.sequence.count('G')  # Count G bases
        c_count = self.sequence.count('C')  # Count C bases
        return round(((g_count + c_count) / len(self.sequence)) * 100, 2)  # Calculate GC%

    def __str__(self):
        return self.name  # Returns the gene name as readable string
