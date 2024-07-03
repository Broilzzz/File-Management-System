import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { decodeJwt } from '../../service/authApi';
import userPic from '../../assets/pics/userPic.png';

function Sidebar() {
  const [userData, setUserData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Create a ref for the file input

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchUserData = async () => {
      try {
        const decoded = decodeJwt(token);
        const userEmail = decoded.sub;

        const response = await axios.get(`http://localhost:8080/api/v1/users/me/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/dashboard');
      }
    };
    
    if (token) {
      fetchUserData();
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleProfilePicChange = async () => {
    if (selectedFile) {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        await axios.post(`http://localhost:8080/api/v1/users/upload/picture/${userData.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        window.location.reload();  // Refresh the page to show the new profile picture
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Programmatically trigger the file input click event
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="w-full md:w-1/4">
      <div className="flex flex-col items-center p-4 border-2 rounded-lg">
      <img
          src={userData.profilePicture ? `data:image/jpeg;base64,${userData.profilePicture}` : userPic}
          alt="Profile Pic"
          className="w-32 h-32 rounded-full mb-4"
        />
        <input
          type="file"
          ref={fileInputRef} // Attach the ref to the file input
          onChange={handleFileChange}
          className="hidden" // Hide the file input
        />
        <button onClick={handleButtonClick} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded mb-4">
          Change Photo
        </button>
        <button onClick={handleProfilePicChange} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4">
          Upload Photo
        </button>
        <div className="text-xl font-bold">{`${userData.firstName} ${userData.lastName}`}</div>
        <div className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded">{userData.role}</div>
      </div>
      <nav className="mt-8">
        <ul>
          <li className="mb-2">
            <NavLink
              to="/profile"
              className={({ isActive }) => isActive ? "flex items-center p-2 text-blue-600 font-medium border-l-4 border-blue-600" : "flex items-center p-2 text-gray-600 hover:text-blue-600 hover:border-blue-600 font-medium border-l-4 border-transparent"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12 4V3a1 1 0 10-2 0v1H7a1 1 0 000 2h3v1H7a1 1 0 100 2h3v1H7a1 1 0 100 2h3v1H7a1 1 0 100 2h3v1H7a1 1 0 000 2h3v1H7a1 1 0 100 2h6a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3z" />
              </svg>
              Profile
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/password"
              className={({ isActive }) => isActive ? "flex items-center p-2 text-blue-600 font-medium border-l-4 border-blue-600" : "flex items-center p-2 text-gray-600 hover:text-blue-600 hover:border-blue-600 font-medium border-l-4 border-transparent"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12 4V3a1 1 0 10-2 0v1H7a1 1 0 000 2h3v1H7a1 1 0 100 2h3v1H7a1 1 0 100 2h3v1H7a1 1 0 100 2h3v1H7a1 1 0 000 2h3v1H7a1 1 0 100 2h6a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3z" />
              </svg>
              Password
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/permissions"
              className={({ isActive }) => isActive ? "flex items-center p-2 text-blue-600 font-medium border-l-4 border-blue-600" : "flex items-center p-2 text-gray-600 hover:text-blue-600 hover:border-blue-600 font-medium border-l-4 border-transparent"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12 4V3a1 1 0 10-2 0v1H7a1 1 0 000 2h3v1H7a1 1 0 100 2h3v1H7a1 1 0 100 2h3v1H7a1 1 0 100 2h3v1H7a1 1 0 000 2h3v1H7a1 1 0 100 2h6a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3v-1h3a1 1 0 100-2h-3z" />
              </svg>
              Permissions
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
