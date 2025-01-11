from django.urls import path
from .views import GeneAPIView

urlpatterns = [
    path('', GeneAPIView.as_view(), name='genes_api'),
    path('<int:pk>/gc_content/', GeneAPIView.gc_content_analysis, name='gc_content'),
]
