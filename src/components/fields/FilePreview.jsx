import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FaFilePdf } from 'react-icons/fa';
import { BsFiletypeDocx, BsFiletypePptx } from 'react-icons/bs';
import { PiFileDoc, PiFilePpt } from 'react-icons/pi';

const FilePreview = ({ file, onClose }) => {
  if (!file) return null;

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'doc':
        return <PiFileDoc className="w-6 h-6 text-blue-600" />;
      case 'docx':
        return <BsFiletypeDocx className="w-6 h-6 text-blue-600" />;
      case 'pdf':
        return <FaFilePdf className="w-6 h-6 text-primary-normal-600" />;
      case 'ppt':
        return <PiFilePpt className="w-6 h-6 text-orange-600" />;
      case 'pptx':
        return <BsFiletypePptx className="w-6 h-6 text-orange-600" />;
      default:
        return (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        );
    }
  };

  // Function to determine if we can preview the file
  const canPreviewFile = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    return ['pdf'].includes(extension); // For now, we'll just support PDF preview
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] text-black">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full h-[90vh] mx-4 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            {getFileIcon(file.name)}
            <div>
              <h3 className="text-lg font-semibold">File Preview</h3>
              <p className="text-sm text-gray-600">
                {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 bg-gray-100 rounded-md overflow-hidden">
          {canPreviewFile(file) ? (
            <iframe 
              src={URL.createObjectURL(file)} 
              className="w-full h-full" 
              title={`Preview of ${file.name}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto mb-4">
                  {getFileIcon(file.name)}
                </div>
                <a 
                  href={URL.createObjectURL(file)} 
                  download={file.name}
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Download File
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview; 