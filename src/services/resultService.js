import api from "./api";

export const getResults = async (studentId = null) => {
  try {
    const response = await api.get('/results/');
    return response.data.map(item => ({
      ...item,
      courseCode: item.course_details?.code || '',
      courseName: item.course_details?.name || '',
      studentName: item.student_details?.user?.first_name + ' ' + item.student_details?.user?.last_name || item.student_details?.user?.email,
      studentIdDisplay: item.student_details?.student_id || '',
      year: Math.floor(item.semester / 2) + 1, // rough estimate
    }));
  } catch (error) {
    console.error("Error fetching results:", error);
    return [];
  }
};

export const addResult = async (resultData) => {
  try {
    const data = {
      student_id_str: resultData.studentId,
      course_code: resultData.courseCode,
      course_name: resultData.courseName,
      grade: resultData.grade,
      semester: parseInt(String(resultData.semester).replace(/\D/g, '')) || 1,
    };
    const response = await api.post('/results/', data);
    return response.data;
  } catch (error) {
    console.error("Error adding result:", error);
    throw error;
  }
};

export const updateResult = async (id, resultData) => {
  try {
    const data = {
      grade: resultData.grade,
      semester: parseInt(String(resultData.semester).replace(/\D/g, '')) || 1,
    };
    if (resultData.studentId) data.student_id_str = resultData.studentId;
    if (resultData.courseCode) data.course_code = resultData.courseCode;
    if (resultData.courseName) data.course_name = resultData.courseName;
    
    const response = await api.patch(`/results/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating result:", error);
    throw error;
  }
};

export const deleteResult = async (id) => {
  try {
    await api.delete(`/results/${id}/`);
  } catch (error) {
    console.error("Error deleting result:", error);
    throw error;
  }
};
