from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserProfile, Student, Course, Result, Complaint, Notification

@admin.register(UserProfile)
class UserProfileAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Profile Info', {'fields': ('firebase_uid', 'role')}),
    )

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'user', 'department')
    list_filter = ('department',)
    search_fields = ('student_id', 'user__username', 'user__email', 'user__first_name', 'user__last_name')

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'semester')
    list_filter = ('semester',)
    search_fields = ('code', 'name')

@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'grade', 'semester', 'uploaded_by', 'created_at')
    list_filter = ('grade', 'semester', 'course__code')
    search_fields = ('student__student_id', 'course__code', 'course__name')

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('complaint_id', 'student', 'course', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('complaint_id', 'student__student_id', 'description')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('user__username', 'message')
