from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserInfoView, CourseViewSet, ResultViewSet,
    ComplaintViewSet, NotificationViewSet, AdminStatsView,
    UserViewSet
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'results', ResultViewSet, basename='result')
router.register(r'complaints', ComplaintViewSet, basename='complaint')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('auth/user/', UserInfoView.as_view(), name='user-info'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
]

urlpatterns += router.urls
