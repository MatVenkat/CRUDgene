from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Gene
from .serializers import GeneSerializer
import pandas as pd

class GeneAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        genes = Gene.objects.all()
        serializer = GeneSerializer(genes, many=True)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request):
        file = request.FILES.get('storage_data')
        if file:
            # Process uploaded file (e.g., .csv)
            input_read = pd.read_csv(file)
            for _, row in input_read.iterrows():
                Gene.objects.create(name=row['name'], sequence=row['sequence'])
        else:
            serializer = GeneSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=201)
        return JsonResponse({'error': 'Invalid data'}, status=400)

    def gc_content_analysis(self, request, pk):
        gene = Gene.objects.get(pk=pk)
        return JsonResponse({'gc_content': gene.gc_content()})
