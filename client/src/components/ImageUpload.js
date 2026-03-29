import React, { useState, useRef } from 'react';
import { Camera, Upload, X, AlertCircle, CheckCircle } from 'lucide-react';

const ImageUpload = ({ 
  onImageSelect, 
  currentImage, 
  onRemoveImage, 
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
  disabled = false
}) => {
  const [preview, setPreview] = useState(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are allowed');
      return false;
    }

    // Check file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return false;
    }

    setError('');
    return true;
  };

  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;

    setUploading(true);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setUploading(false);
      if (onImageSelect) {
        onImageSelect(file);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`image-upload-container ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {preview ? (
        // Image Preview
        <div className="relative group">
          <div className="relative overflow-hidden rounded-lg border-2 border-gray-200">
            <img
              src={preview}
              alt="Employee"
              className="w-full h-48 object-cover"
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={handleClick}
                disabled={disabled}
                className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                title="Change image"
              >
                <Camera className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={disabled}
                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Upload status */}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      ) : (
        // Upload Area
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-3 rounded-full ${
              dragOver ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Upload className={`h-6 w-6 ${
                dragOver ? 'text-blue-600' : 'text-gray-400'
              }`} />
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-900">
                {dragOver ? 'Drop image here' : 'Upload employee photo'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Click to browse or drag and drop
              </p>
            </div>
            
            <div className="text-xs text-gray-400">
              <p>Accepted formats: JPEG, PNG, WebP</p>
              <p>Maximum size: {maxSize / 1024 / 1024}MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {!error && preview && (
        <div className="mt-2 flex items-center space-x-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <p className="text-sm">Image uploaded successfully</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-2 text-xs text-gray-500">
        <p>• Upload a clear, professional photo of the employee</p>
        <p>• Recommended size: 200x200 pixels</p>
        <p>• Face should be clearly visible</p>
      </div>
    </div>
  );
};

export default ImageUpload;
