import React, { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { getFileById, downloadFile, deleteFile, updateFile } from '../../service/authApi';
import csvPic from '../../assets/pics/csv-file.png';
import docPic from '../../assets/pics/docx.png';
import pdfPic from '../../assets/pics/pdf_pic.png';
import jpegPic from '../../assets/pics/jpeg.png';
import pptPic from '../../assets/pics/ppt.png';
import pngPic from '../../assets/pics/png.png';
import txtPic from '../../assets/pics/txt.png';
import xlsxPic from '../../assets/pics/xlsx.png';
import Navbar from '../layout/Navbar';



const FileDetails = () => {
  const { fileNumber } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [updatedFileName, setUpdatedFileName] = useState('');
  const [updatedBio, setUpdatedBio] = useState('');

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await getFileById(fileNumber);
        console.log(response.data)
        setFile(response.data);
        setUpdatedFileName(response.data.fileName);
        setUpdatedBio(response.data.bio);
      } catch (error) {
        setError('Failed to fetch file details');
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [fileNumber]);

  if (loading) {
    return <div className=' text-center align-middle'>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!file) {
    return <div>No file found</div>;
  }

  function formatFileSize(sizeInBytes) {
    if (sizeInBytes >= 1048576) { // 1 MB = 1024 * 1024 bytes
      return (sizeInBytes / 1048576).toFixed(2) + ' MB';
    } else if (sizeInBytes >= 1024) { // 1 KB = 1024 bytes
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

  const handleDownload = ()=> {
    const token = localStorage.getItem('token');
    downloadFile(fileNumber, token, file.fileName);
  };
  
  const handleDelete = async ()=> {
    const token = localStorage.getItem('token');
    try{
      await deleteFile(fileNumber, token);
      setNotification({
        type: 'success',
        message: 'File Deleted Successfully',
      });
    }catch (e){
      console.log('error deleting file: ', e);
      setNotification({
        type: 'error',
        message: 'Failed to delete file. Please try again later.',
      });
    }
  }

  const renderNotification = () => {
    if (!notification) return null;

    let bgColorClass, borderColorClass, textColorClass, icon;
    if (notification.type === 'success') {
      bgColorClass = 'bg-teal-100';
      borderColorClass = 'border-teal-500';
      textColorClass = 'text-teal-900';
      icon = (
        <svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
        </svg>
      );
    } else if (notification.type === 'error') {
      bgColorClass = 'bg-red-100';
      borderColorClass = 'border-red-500';
      textColorClass = 'text-red-900';
      icon = (
        <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M17.293 8l1.414-1.414a1 1 0 0 0-1.414-1.414L16.586 6l-1.414-1.414a1 1 0 0 0-1.414 1.414L15.172 8l-1.414 1.414a1 1 0 1 0 1.414 1.414L16.586 10l1.414 1.414a1 1 0 1 0 1.414-1.414L17.293 8zm-7.778 8l-1.416-1.416a1 1 0 0 0-1.412 1.412L9.174 18l-1.416 1.416a1 1 0 0 0 1.412 1.412L10 19.826l1.416 1.416a1 1 0 0 0 1.412-1.412L10.826 18l1.416-1.416a1 1 0 0 0-1.412-1.412L10 16.174z"/>
        </svg>
      );
    }

    return (
      <div className={`bg-teal-100 border-t-4 ${borderColorClass} rounded-b text-teal-900 px-4 py-3 shadow-md`} role="alert">
        <div className="flex">
          <div className="py-1">
            {icon}
          </div>
          <div>
            <p className="font-bold">{notification.message}</p>
          </div>
        </div>
      </div>
    );
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      const updatedData = {};
      let newFileName = updatedFileName;
  
      // Ensure the file name includes the file type
      if (!newFileName.endsWith(`.${file.fileType}`)) {
        newFileName += `.${file.fileType}`;
      }
  
      if (newFileName !== file.fileName) {
        updatedData.fileName = newFileName;
      }else{
        updatedData.fileName = file.fileName;
      }
      if (updatedBio !== file.bio) {
        updatedData.bio = updatedBio;
      }else{
        updatedData.bio = file.bio;
      }
  
      const updatedFile = await updateFile(fileNumber, token, updatedData);
      setFile(updatedFile.data);
      setNotification({
        type: 'success',
        message: 'File Updated Successfully',
      });
  
      window.location.reload();
  
    } catch (error) {
      console.error('Update failed:', error);
      setNotification({
        type: 'error',
        message: 'Failed to update file details. Please try again later.',
      });
    }
  };
  

  const fullName = file.userFirstName+" "+file.userLastName;

  return (
    <div>
      <Navbar/>
      <div className="container mx-auto p-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <div className="flex items-center border-2 p-4 rounded-lg">
              <img src={handlePic(file.fileType)} alt={file.fileType} className="w-20 h-20 mr-4" />
              <div>
                <h2 className="text-2xl font-bold">{file.fileName}</h2>
                <div className="flex mt-2">
                  <button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded mr-2">Download</button>
                  <button onClick={handleDelete} className="bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded">Delete</button>
                  {renderNotification()}
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Document Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Name</label>
                  <input type="text" onChange={(e) => setUpdatedFileName(e.target.value)} value={updatedFileName} className="w-full border-2 rounded p-2"/>
                </div>
                <div>
                  <label className="block font-medium">Size</label>
                  <input type="text" value={formatFileSize(file.fileSize)} className="w-full bg-zinc-200 border-2 rounded p-2" readOnly />
                </div>
                <div>
                  <label className="block font-medium">Last Updated By</label>
                  <input type="text" value={file.lastEditedBy} className="w-full bg-zinc-200 border-2 rounded p-2" readOnly />
                </div>
                <div>
                  <label className="block font-medium">Created At</label>
                  <input type="text" value={file.createdOn} className="w-full bg-zinc-200 border-2 rounded p-2" readOnly />
                </div>
                <div>
                  <label className="block font-medium">Last Updated At</label>
                  <input type="text" value={file.lastEditedOn} className="w-full bg-zinc-200 border-2 rounded p-2" readOnly />
                </div>
                <div>
                  <label className="block font-medium">URI</label>
                  <input type="text" value={file.filePath} className="w-full bg-zinc-200 border-2 rounded p-2 text-xs" readOnly />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-medium">Description</label>
                  <textarea onChange={(e)=> setUpdatedBio(e.target.value)} className="w-full border-2 rounded p-2" rows="3" value={updatedBio} />
                </div>
              </div>
              <button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded mt-4">Update</button>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-bold mb-4">Document Owner</h3>
            <div className="border-2 p-4 rounded-lg">
              <div className="mb-4">
                <label className="block font-medium">Name</label>
                <input type="text" value={fullName} className="w-full bg-zinc-200 border-2 rounded p-2" readOnly />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Email</label>
                <input type="text" value={file.userEmail} className="w-full bg-zinc-200 border-2 rounded p-2" readOnly />
              </div>
              <div>
                <label className="block font-medium">Role: </label>
                <input type="text" value={file.userRole} className="w-full bg-zinc-200 border-2 rounded p-2" readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetails;
