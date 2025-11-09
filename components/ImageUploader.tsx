
import React, { useRef } from 'react';
import { UploadIcon } from './Icons.tsx';

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
  imagePreviewUrl: string | null;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, imagePreviewUrl, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onImageSelect(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isLoading) return;
    const file = event.dataTransfer.files?.[0] || null;
    onImageSelect(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="w-full">
      <label
        htmlFor="image-upload"
        className={`relative block w-full h-64 md:h-80 border-2 border-dashed border-dark-base-300 rounded-lg cursor-pointer transition-colors duration-200 ${!isLoading && 'hover:border-brand-primary hover:bg-dark-base-200'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          id="image-upload"
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        {imagePreviewUrl ? (
          <img
            src={imagePreviewUrl}
            alt="Chart preview"
            className="w-full h-full object-contain rounded-lg p-2"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <UploadIcon className="h-12 w-12 mb-4" />
            <span className="font-semibold">Click to upload or drag & drop</span>
            <span className="text-sm">PNG, JPG, or WEBP</span>
          </div>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;