import axios from './axios'; // Import the configured axios instance
import { jwtDecode } from "jwt-decode";

export function decodeJwt(token) {
  return jwtDecode(token);
}


export const register = async (registrationData) => {
  const response = await axios.post('/api/v1/auth/signup', registrationData);
  return response.data;
};

export const confirmRegistration = async (token) => {
  const response = await axios.get('/api/v1/auth/confirm', {
    params: { token },
  });
  return response.data;
};

export const login = async (signInData) => {
  const response = await axios.post('/api/v1/auth/signin', signInData);
  return response.data;
};



export const getAllFiles = async () => {
  const response = await axios.get('/api/v1/files');
  return response.data;
};

export const getFileById = async (id) => {
  const response = await axios.get(`/api/v1/files/${id}`);
  return response.data;
};

export const getUserByEmail = async (email) => {
  const response = await axios.get(`/api/v1/users/me/${email}`);
  return response.data;
};

export const uploadFile = async (file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/api/v1/files/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteFile = async (id, token) => {
  try {
    await axios.delete(`/api/v1/files/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return 'success'; // Assuming success, you can customize the return value based on your needs
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error; // Optionally handle errors or propagate them to the caller
  }
};


export const downloadFile = async (id, token, fileName) => {
  try {
    const response = await axios.get(`/api/v1/files/download/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      responseType: 'blob',
    });

    // Create a URL for the blob object
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create a link element
    const link = document.createElement('a');
    link.href = url;

    // Extract filename from content-disposition header, if available
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = fileNameRegex.exec(contentDisposition);
      if (matches != null && matches[1]) {
        fileName = matches[1].replace(/['"]/g, '');
      }
    }

    // Set the download attribute with the filename
    link.setAttribute('download', fileName);

    // Append the link to the document body and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up by revoking the object URL and removing the link
    window.URL.revokeObjectURL(url);
    link.remove();
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

export const uploadFileNew = async (formData, token) => {
  try {
    const response = await axios.post('/api/v1/files/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
    
  } catch (error) {
    throw error;
  }
};



export const updateFile = async(id, token, updatedData)=>{
  try {
    const response = await axios.post(`/api/v1/files/update/${id}`, updatedData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;  // Return the data from the response
  } catch (error) {
    console.error('Error updating file:', error);
    throw error; 
  }
};

export const promote = async(id, token)=>{
  try {
    await axios.post(`/api/v1/users/promote/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return 'success'; // Assuming success, you can customize the return value based on your needs
  } catch (error) {
    console.error('Error promoting user: ', error);
    throw error; // Optionally handle errors or propagate them to the caller
  }
};


export const demote = async(id, token)=>{
  try {
    await axios.post(`/api/v1/users/demote/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return 'success'; 
  } catch (error) {
    console.error('Error demoting user: ', error);
    throw error;
  }
};

export const deleteUser = async (id, token) => {
  try {
    await axios.delete(`/api/v1/users/delete/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return 'success'; 
  } catch (error) {
    console.error('Error deleting user: ', error);
    throw error; 
  }
};  