from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class UserProfile(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('admin', 'Admin'),
    )
    firebase_uid = models.CharField(max_length=255, unique=True, null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

class Student(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='student_profile')
    student_id = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.student_id} ({self.user.username})"

class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    semester = models.IntegerField()

    def __str__(self):
        return f"{self.code} - {self.name}"

class Result(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='results')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='results')
    grade = models.CharField(max_length=5)
    semester = models.IntegerField()
    uploaded_by = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, related_name='uploaded_results')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.student_id} - {self.course.code}: {self.grade}"

class Complaint(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Resolved', 'Resolved'),
    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='complaints')
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name='complaints')
    description = models.TextField()
    complaint_id = models.CharField(max_length=100, unique=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    response = models.TextField(blank=True, null=True)
    handled_by = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='handled_complaints')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.complaint_id:
            self.complaint_id = str(uuid.uuid4())[:8].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.complaint_id

class Notification(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"To {self.user.username}: {self.message[:20]}"
