import React, { useEffect, useState } from 'react';
import Navbar from '../layout/Navbar';
import { getAllFiles, deleteFile, uploadFileNew } from '../../service/authApi';
import csvPic from '../../assets/pics/csv-file.png';
import docPic from '../../assets/pics/docx.png';
import pdfPic from '../../assets/pics/pdf_pic.png';
import jpegPic from '../../assets/pics/jpeg.png';
import pptPic from '../../assets/pics/ppt.png';
import pngPic from '../../assets/pics/png.png';
import txtPic from '../../assets/pics/txt.png';
import xlsxPic from '../../assets/pics/xlsx.png';
import eye from '../../assets/pics/view.png';
import data from '../../assets/pics/database.png';
import { Link, useNavigate, Navigate } from 'react-router-dom';

function UserDashboard() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');
  const [successfully, setSuccessfully] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadOption, setUploadOption] = useState('select-file');

  const navigate = useNavigate();

  const handleUploadChangeOption = (event) => {
    setUploadOption(event.target.value);
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await getAllFiles();
        console.log(response);
        setFiles(response.data);
      } catch (err) {
        setMessage('Failed to fetch files. Please try again later.');
      }
    };

    fetchFiles();
  }, []);

  const handleUpload = async () => {
    const token = localStorage.getItem('token');

    if (uploadOption === 'select-file' && !file) {
      setMessage('Please select a file.');
      return;
    }

    if (uploadOption === 'type-bio' && !bio) {
      setMessage('Please enter a bio.');
      return;
    }

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (bio) formData.append('bio', bio);

    try {
      const response = await uploadFileNew(formData, token);
      console.log(response.data);
      setSuccessfully('File uploaded successfully.');
      window.location.reload();
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage('Failed to upload file. Please try again.');
    }
  };

  function formatFileSize(sizeInBytes) {
    if (sizeInBytes >= 1048576) {
      return (sizeInBytes / 1048576).toFixed(2) + ' MB';
    } else if (sizeInBytes >= 1024) {
      return (sizeInBytes / 1024).toFixed(2) + ' KB';
    } else {
      return sizeInBytes + ' bytes';
    }
  }

  const handlePic = (fileType) => {
    switch (fileType) {
      case 'csv':
        return csvPic;
      case 'doc':
      case 'docx':
        return docPic;
      case 'pdf':
        return pdfPic;
      case 'jpg':
      case 'jpeg':
        return jpegPic;
      case 'ppt':
      case 'pptx':
        return pptPic;
      case 'png':
        return pngPic;
      case 'txt':
        return txtPic;
      case 'xlsx':
        return xlsxPic;
      default:
        return csvPic;
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleFileClick = (id) => {
    navigate(`/dashboard/details/${id}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  // Filter files based on the search query
  const filteredFiles = files.filter((file) =>
    file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto mt-3 flex flex-col md:flex-row items-center">
        <form className="flex w-full" onSubmit={handleSearch}>
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="search" 
              id="default-search" 
              className="block p-4 pl-10 text-sm rounded-3xl text-gray-500 border border-gray-300 rounded-l-lg bg-white focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500" 
              placeholder="Search Files" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required 
            />
          </div>
          {/* <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-r-lg text-sm mr-24 px-4 py-2">Search</button> */}
        </form>
        <div className="relative">
          <label htmlFor="upload-options" className="sr-only">Upload Options</label>
          <select id="upload-options" onChange={handleUploadChangeOption} className="text-sm rounded-lg px-3 py-2 border border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500">
            <option value="select-file">Select File</option>
            <option value="type-bio">Type Bio</option>
          </select>
          <button type="button" onClick={handleUpload} className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2 md:mt-0 md:ml-2">Upload</button>
        </div>
        <div className="w-full mt-2">
          {uploadOption === 'select-file' && (
            <input 
              type="file" 
              className="block w-fit text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none" 
              onChange={handleFileChange}
            />
          )}
          {uploadOption === 'type-bio' && (
            <textarea 
              className="block w-fit text-sm text-gray-500 border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Type your bio here..." 
              value={bio}
              onChange={handleBioChange}
            ></textarea>
          )}
        </div>
      </div>
      
      <div className='text-center'>
        {successfully && <p className="text-green-500 mt-2">{successfully}</p>}
      </div>

      <div className='text-center'>
        {message && <p className="text-red-500 mt-2">{message}</p>}
      </div>

      <div className='p-6 w-screen rounded-xl shadow-lg'>
        {/* <h2 className="text-2xl font-semibold mb-4 text-center">Files Dashboard</h2> */}
        <div>
          {filteredFiles.map((file) => (
            <div key={file.id} className="w-auto h-auto border-2 mt-10 pb-5 mb-10 border-gray-300 flex cursor-pointer" onClick={() => handleFileClick(file.id)}>
              <div className="flex-none w-32 h-28 border-2 border-gray-300 mt-6 ml-3 text-center">
                <img src={handlePic(file.fileType)} alt={file.fileType} className='w-24 h-24 mx-auto'/>
              </div>
              <div className="mt-5 ml-6">
                <div className="font-semibold">
                  {file.fileName}
                </div>
                <div className="flex box-border h-9 w-36 pl-4 pb-7 pt-1 rounded-xl mt-1 bg-blue-400 text-white">
                  <div className='w-7 mr-2'>
                    <img src={data} alt="" />
                  </div>
                  {formatFileSize(file.fileSize)}
                </div>
                <div className="text-gray-500 mt-1">
                  Owner: {`${file.userFirstName} ${file.userLastName}`}
                </div>
                <div className="text-gray-500 mt-2">
                  Created On: {new Date(file.createdOn).toLocaleString()}
                </div>
              </div>
              <div className="text-medium mt-14 ml-56 box-border h-fit w-auto pr-3 bg-gray-300 rounded-xl pl-2 pt-2 pb-2 font-bold text-gray-500">
                Type: {file.fileType.toUpperCase()}
              </div>
              <div className="text-medium mt-14 ml-3 box-border h-fit bg-gray-300 rounded-xl pb-2 pr-3 pl-3 pt-2 font-bold text-gray-500">
                RAW SIZE: {file.fileSize} Bytes
              </div>
              <div className='ml-auto mr-3 w-10'>
                <img src={eye} alt="" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
