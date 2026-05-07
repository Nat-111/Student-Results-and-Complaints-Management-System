import api from "./api";

export const getComplaints = async () => {
  try {
    const response = await api.get('/complaints/');
    return response.data.map(item => ({
      ...item,
      subject: item.course_details ? `Issue with ${item.course_details.code}` : 'General Issue',
      category: 'Complaint',
      studentName: item.student_details?.user?.first_name + ' ' + item.student_details?.user?.last_name || item.student_details?.user?.email,
      studentIdDisplay: item.student_details?.student_id || '',
      staffResponse: item.response,
    }));
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return [];
  }
};

export const submitComplaint = async (complaintData) => {
  try {
    const fullDescription = `[Category: ${complaintData.category}] [Subject: ${complaintData.subject}]\n\n${complaintData.description}`;
    const data = {
      description: fullDescription,
      course: complaintData.courseId || null,
    };
    const response = await api.post('/complaints/', data);
    return response.data;
  } catch (error) {
    console.error("Error submitting complaint:", error);
    throw error;
  }
};

export const updateComplaintStatus = async (id, status, responseText = "") => {
  try {
    const response = await api.patch(`/complaints/${id}/`, {
      status,
      response: responseText
    });
    return response.data;
  } catch (error) {
    console.error("Error updating complaint:", error);
    throw error;
  }
};
