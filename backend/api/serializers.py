from rest_framework import serializers
from .models import UserProfile, Student, Course, Result, Complaint, Notification

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'firebase_uid', 'username', 'email', 'first_name', 'last_name', 'role', 'created_at']

class StudentSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    class Meta:
        model = Student
        fields = ['id', 'user', 'student_id', 'department']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class ResultSerializer(serializers.ModelSerializer):
    course_details = CourseSerializer(source='course', read_only=True)
    student_details = StudentSerializer(source='student', read_only=True)
    
    student_id_str = serializers.CharField(write_only=True, required=False)
    course_code = serializers.CharField(write_only=True, required=False)
    course_name = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Result
        fields = ['id', 'student', 'student_details', 'course', 'course_details', 'grade', 'semester', 'uploaded_by', 'created_at', 'student_id_str', 'course_code', 'course_name']
        read_only_fields = ['uploaded_by']
        extra_kwargs = {
            'student': {'required': False},
            'course': {'required': False}
        }
        
    def create(self, validated_data):
        student_id_str = validated_data.pop('student_id_str', None)
        course_code = validated_data.pop('course_code', None)
        course_name = validated_data.pop('course_name', 'Unknown Course')
        
        if student_id_str:
            student, _ = Student.objects.get_or_create(student_id=student_id_str, defaults={'department': 'Unknown'})
            validated_data['student'] = student
            
        if course_code:
            course, _ = Course.objects.get_or_create(code=course_code, defaults={'name': course_name, 'semester': validated_data.get('semester', 1)})
            validated_data['course'] = course
            
        return super().create(validated_data)

    def update(self, instance, validated_data):
        student_id_str = validated_data.pop('student_id_str', None)
        course_code = validated_data.pop('course_code', None)
        course_name = validated_data.pop('course_name', 'Unknown Course')
        
        if student_id_str:
            student, _ = Student.objects.get_or_create(student_id=student_id_str, defaults={'department': 'Unknown'})
            validated_data['student'] = student
            
        if course_code:
            course, _ = Course.objects.get_or_create(code=course_code, defaults={'name': course_name, 'semester': validated_data.get('semester', instance.semester)})
            validated_data['course'] = course
            
        return super().update(instance, validated_data)

class ComplaintSerializer(serializers.ModelSerializer):
    course_details = CourseSerializer(source='course', read_only=True)
    student_details = StudentSerializer(source='student', read_only=True)

    class Meta:
        model = Complaint
        fields = ['id', 'student', 'student_details', 'course', 'course_details', 'description', 'complaint_id', 'status', 'response', 'handled_by', 'created_at', 'updated_at']
        read_only_fields = ['complaint_id', 'status', 'response', 'handled_by', 'student']

class ComplaintStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['id', 'status', 'response', 'handled_by']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
