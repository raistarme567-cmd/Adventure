
import React, { useState, useRef } from 'react';
import { Post } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (p: Post) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPost }) => {
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [link, setLink] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleShare = () => {
    if (!preview) return;

    // Basic URL extraction from caption if link field is empty
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const extractedLink = link || caption.match(urlRegex)?.[0];

    const newPost: Post = {
      id: Date.now().toString(),
      user: {
        id: 'me',
        username: 'gemini_user',
        profilePic: 'https://picsum.photos/150/150?random=10',
        isVerified: true
      },
      imageUrl: uploadType === 'image' ? preview : 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', // Placeholder for video poster
      videoUrl: uploadType === 'video' ? preview : undefined,
      mediaType: uploadType,
      title: title,
      caption: caption,
      externalLink: extractedLink,
      likes: 0,
      comments: 0,
      timestamp: 'Just now'
    };

    onPost(newPost);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setPreview(null);
    setTitle('');
    setCaption('');
    setLink('');
    setUploadType('image');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[600px]">
        {/* Left Side: Preview/Upload */}
        <div className="flex-1 bg-gray-50 flex items-center justify-center border-r relative group">
          {preview ? (
            uploadType === 'image' ? (
              <img src={preview} className="w-full h-full object-contain bg-black" alt="Preview" />
            ) : (
              <video src={preview} className="w-full h-full object-contain bg-black" controls autoPlay loop muted />
            )
          ) : (
            <div className="text-center p-8 flex flex-col items-center">
              <div className="w-24 h-24 mb-4 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <i className={`fa-solid ${uploadType === 'image' ? 'fa-image' : 'fa-clapperboard'} text-5xl`}></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Upload {uploadType === 'image' ? 'Photo' : 'Video'}</h3>
              <p className="text-gray-500 text-sm mb-6">Select a file from your computer to share</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Select from computer
              </button>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept={uploadType === 'image' ? "image/*" : "video/*"} 
            className="hidden" 
          />
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-[350px] flex flex-col bg-white">
          <div className="p-4 border-b flex items-center justify-between">
            <button onClick={onClose} className="text-gray-400 hover:text-black"><i className="fa-solid fa-xmark text-xl"></i></button>
            <span className="font-bold">New {uploadType === 'image' ? 'Post' : 'Reel'}</span>
            <button 
              onClick={handleShare}
              disabled={!preview}
              className="text-blue-500 font-bold disabled:opacity-30"
            >
              Share
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-5">
            {/* Tab Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => { resetForm(); setUploadType('image'); }}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${uploadType === 'image' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
              >
                PHOTO
              </button>
              <button 
                onClick={() => { resetForm(); setUploadType('video'); }}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${uploadType === 'video' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
              >
                VIDEO / REEL
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Catchy heading..."
                  className="w-full border-b py-2 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                <textarea 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full h-24 border rounded-lg p-3 text-sm resize-none outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">External Link (Optional)</label>
                <div className="flex items-center gap-2 border-b py-2">
                  <i className="fa-solid fa-link text-gray-400 text-xs"></i>
                  <input 
                    type="text" 
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="example.com"
                    className="flex-1 text-sm outline-none"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 italic">Will show a clickable button on post</p>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                <span className="text-[11px] font-bold uppercase">Pro Tip</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Add #hashtags in the description to reach more people in search!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
