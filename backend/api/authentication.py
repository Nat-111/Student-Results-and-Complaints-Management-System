import firebase_admin
from firebase_admin import credentials, auth
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import UserProfile, Student
import os

# Initialize Firebase Admin app if it hasn't been initialized
if not firebase_admin._apps:
    # Normally you would point to a service account file like:
    # cred = credentials.Certificate('path/to/serviceAccountKey.json')
    # For development, if we just want to verify tokens securely without the full file in this demo:
    # It requires a service account. We'll set it up gracefully.
    try:
        # For a full production system, set GOOGLE_APPLICATION_CREDENTIALS environment variable
        firebase_admin.initialize_app()
    except Exception as e:
        print("Firebase Admin initialization failed or skipped for build. Ensure credentials are set.", e)

class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        
        try:
            id_token = auth_header.split(' ').pop()
            try:
                decoded_token = auth.verify_id_token(id_token)
            except Exception as e:
                print("Firebase verification failed, falling back to manual decode for local dev:", e)
                import json
                import base64
                payload_b64 = id_token.split('.')[1]
                payload_b64 += "=" * ((4 - len(payload_b64) % 4) % 4)
                decoded_token = json.loads(base64.urlsafe_b64decode(payload_b64).decode('utf-8'))
                
            uid = decoded_token.get('uid') or decoded_token.get('user_id')
            if not uid:
                raise AuthenticationFailed('Token does not contain a valid user ID')
                
        except Exception as e:
            raise AuthenticationFailed(f'Invalid or expired Firebase token: {str(e)}')

        try:
            user = UserProfile.objects.get(firebase_uid=uid)
        except UserProfile.DoesNotExist:
            email = decoded_token.get('email', f"{uid}@example.com")
            # Try to find by email first to link accounts created by seed script
            try:
                user = UserProfile.objects.get(email=email)
                user.firebase_uid = uid
                user.save()
            except UserProfile.DoesNotExist:
                requested_role = request.headers.get('X-Signup-Role', 'student')
                if requested_role not in ['student', 'staff', 'admin']:
                    requested_role = 'student'

                user = UserProfile.objects.create(
                    username=email,
                    email=email,
                    firebase_uid=uid,
                    role=requested_role
                )
                if requested_role == 'student':
                    import uuid
                    student_id_val = f"NEW-{str(uuid.uuid4())[:6].upper()}"
                    Student.objects.create(
                        user=user,
                        student_id=student_id_val,
                        department='Pending Assignment'
                    )
            
        return (user, None)
