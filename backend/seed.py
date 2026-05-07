import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import UserProfile, Student, Course, Result, Complaint

def seed():
    # Create Admin
    admin, _ = UserProfile.objects.get_or_create(
        username='admin@example.com',
        defaults={'email': 'admin@example.com', 'role': 'admin', 'first_name': 'Super', 'last_name': 'Admin'}
    )
    admin.set_password('password123')
    admin.save()

    # Create Staff
    staff, _ = UserProfile.objects.get_or_create(
        username='staff@example.com',
        defaults={'email': 'staff@example.com', 'role': 'staff', 'first_name': 'John', 'last_name': 'Doe'}
    )
    staff.set_password('password123')
    staff.save()

    # Create Student
    student_user, _ = UserProfile.objects.get_or_create(
        username='student@example.com',
        defaults={'email': 'student@example.com', 'role': 'student', 'first_name': 'Jane', 'last_name': 'Smith'}
    )
    student_user.set_password('password123')
    student_user.save()

    student, _ = Student.objects.get_or_create(
        user=student_user,
        defaults={'student_id': 'STU1001', 'department': 'Computer Science'}
    )

    # Create Courses
    c1, _ = Course.objects.get_or_create(name='Data Structures', code='CS201', semester=3)
    c2, _ = Course.objects.get_or_create(name='Algorithms', code='CS202', semester=3)

    # Create Result
    Result.objects.get_or_create(student=student, course=c1, defaults={'grade': 'A', 'semester': 3, 'uploaded_by': staff})
    Result.objects.get_or_create(student=student, course=c2, defaults={'grade': 'B+', 'semester': 3, 'uploaded_by': staff})

    # Create Complaint
    Complaint.objects.get_or_create(student=student, course=c1, defaults={'description': 'Missing assignment marks in final grade.', 'status': 'Pending'})

    print("Database seeded successfully.")

if __name__ == '__main__':
    seed()
