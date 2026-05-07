from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import UserProfile, Student, Course, Result, Complaint, Notification
from .serializers import (
    UserProfileSerializer, StudentSerializer, CourseSerializer,
    ResultSerializer, ComplaintSerializer, ComplaintStaffSerializer,
    NotificationSerializer
)

class IsStaffOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['staff', 'admin']

class AdminStatsView(views.APIView):
    permission_classes = [IsStaffOrAdmin]

    def get(self, request):
        students_count = UserProfile.objects.filter(role='student').count()
        staff_count = UserProfile.objects.filter(role='staff').count()
        total_complaints = Complaint.objects.count()
        resolved_complaints = Complaint.objects.filter(status='Resolved').count()
        
        # Recent complaints for activity
        recent_complaints = ComplaintSerializer(Complaint.objects.all().order_by('-created_at')[:5], many=True).data
        
        return Response({
            'total_students': students_count,
            'total_staff': staff_count,
            'total_complaints': total_complaints,
            'resolved_complaints': resolved_complaints,
            'recent_complaints': recent_complaints
        })

class UserInfoView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        student_data = None
        if request.user.role == 'student':
            try:
                student = Student.objects.get(user=request.user)
                student_data = StudentSerializer(student).data
            except Student.DoesNotExist:
                pass
        
        data = serializer.data
        data['student_info'] = student_data
        return Response(data)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsStaffOrAdmin]
        else:
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()

class UserViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all().order_by('-created_at')
    serializer_class = UserProfileSerializer
    permission_classes = [IsStaffOrAdmin]

class ResultViewSet(viewsets.ModelViewSet):
    serializer_class = ResultSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            try:
                student = Student.objects.get(user=user)
                return Result.objects.filter(student=student)
            except Student.DoesNotExist:
                return Result.objects.none()
        return Result.objects.all()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsStaffOrAdmin]
        else:
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()
        
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
        # Notify student
        Notification.objects.create(
            user=serializer.validated_data['student'].user,
            message=f"New result uploaded for {serializer.validated_data['course'].code}"
        )

class ComplaintViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.request.user.role in ['staff', 'admin'] and self.action in ['update', 'partial_update']:
            return ComplaintStaffSerializer
        return ComplaintSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            try:
                student = Student.objects.get(user=user)
                return Complaint.objects.filter(student=student).order_by('-created_at')
            except Student.DoesNotExist:
                return Complaint.objects.none()
        return Complaint.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        student = Student.objects.get(user=self.request.user)
        serializer.save(student=student)

    def perform_update(self, serializer):
        old_status = self.get_object().status
        instance = serializer.save(handled_by=self.request.user)
        if old_status != instance.status or instance.response:
            # Notify student
            Notification.objects.create(
                user=instance.student.user,
                message=f"Your complaint {instance.complaint_id} has been updated. Status: {instance.status}"
            )

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})
