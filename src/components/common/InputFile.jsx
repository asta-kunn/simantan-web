import React, { useRef, useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { BsFiletypeDocx, BsFiletypePptx } from 'react-icons/bs';
import { PiFileDoc, PiFilePpt } from 'react-icons/pi';
import FilePreview from '@/components/fields/FilePreview';

const InputFile = ({
  onFilesSelected,
  accept = '.doc,.docx,.pdf,.ppt,.pptx',
  maxSizeMB = 20,
}) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tooltipFile, setTooltipFile] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleDragOver = e => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = e => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = e => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    triggerFiles(files);
  };
  const handleClick = () => fileInputRef.current.click();
  const handleChange = e => {
    const files = Array.from(e.target.files);
    triggerFiles(files);
  };

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

  const triggerFiles = files => {
    if (!files.length) return;
    
    // Validate file types
    const allowedTypes = accept.split(',').map(type => type.trim());
    const invalidFiles = files.filter(file => {
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      return !allowedTypes.includes(fileExtension);
    });

    if (invalidFiles.length > 0) {
      alert(`File type not allowed. Allowed types: ${accept}`);
      return;
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (files.some(f => f.size > maxSize)) {
      alert(`Maksimum ukuran file ${maxSizeMB} MB`);
      return;
    }

    setUploadedFiles(files);
    onFilesSelected?.(files);
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setShowPreview(true);
  };
  
  const handleMouseEnter = (e, file) => {
    setTooltipFile(file);
    setTooltipPosition({ 
      x: e.clientX, 
      y: e.clientY 
    });
  };
  
  const handleMouseLeave = () => {
    setTooltipFile(null);
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedFile(null);
  };

  return (
    <>
      <div
        className={`text-black w-[170px] h-[100px] border border-dashed rounded-[10px]
                    flex flex-col items-start justify-center gap-[4px] px-4
                    ${
                      isDragOver
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-white'
                    }`}
        style={{ userSelect: 'none' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {uploadedFiles.length > 0 ? (
          <div className="w-full">
            {uploadedFiles.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileClick(file);
                }}
                onMouseEnter={(e) => handleMouseEnter(e, file)}
                onMouseLeave={handleMouseLeave}
              >
                {getFileIcon(file.name)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-gray-700 font-bold text-base text-left">
              Click or drag file to this area
            </p>
            <p className="text-gray-500 text-xs mt-0 text-left">
              DOCX, PDF, PPT (max. {maxSizeMB} MB)
            </p>
          </>
        )}
        <button
          type="button"
          className="w-[135px] h-[30px] flex items-center justify-center
                     gap-[12px] px-[24px] py-[12px] border rounded-[5px] text-xs transition-colors hover:bg--primary-normal hover:text-white font-bold"
          style={{
            borderColor:
              'var(--Dexa-Light-Primary-primary-normal-default, #B32017)',
            color: 'var(--Dexa-Light-Primary-primary-normal-default, #B32017)',
          }}
        >
          Select File
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />
      </div>

      {/* Tooltip for file info */}
      {tooltipFile && (
        <div 
          className="absolute bg-white shadow-lg rounded-md p-2 z-50 text-sm border"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`,
            maxWidth: '250px'
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            {getFileIcon(tooltipFile.name)}
            <span className="font-medium">{tooltipFile.name}</span>
          </div>
          <p className="text-xs text-gray-600">Size: {(tooltipFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          <p className="text-xs text-gray-600">Type: {tooltipFile.type || 'Unknown'}</p>
          <p className="text-xs text-gray-600">Last modified: {new Date(tooltipFile.lastModified).toLocaleString()}</p>
        </div>
      )}

      {/* File Preview */}
      {showPreview && selectedFile && (
        <FilePreview 
          file={selectedFile} 
          onClose={closePreview} 
        />
      )}
    </>
  );
};

export default InputFile;