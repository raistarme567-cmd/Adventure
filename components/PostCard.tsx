
import React, { useState, useRef, useEffect } from 'react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  isFollowing?: boolean;
  onFollow?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, isFollowing, onFollow }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  useEffect(() => {
    if (post.mediaType === 'video' && videoRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
          } else {
            videoRef.current?.pause();
          }
        },
        { threshold: 0.7 }
      );
      observer.observe(videoRef.current);
      return () => observer.disconnect();
    }
  }, [post.mediaType, post.videoUrl]);

  return (
    <div className="bg-white border-b md:border border-gray-200 md:rounded-lg mb-4 w-full max-w-[470px] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-[1.5px] rounded-full instagram-gradient cursor-pointer">
            <div className="p-[1.5px] bg-white rounded-full">
              <img src={post.user.profilePic} alt={post.user.username} className="w-8 h-8 rounded-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[14px] hover:text-gray-500 cursor-pointer tracking-tight text-black">{post.user.username}</span>
              {post.user.isVerified && <i className="fa-solid fa-circle-check text-blue-500 text-[12px]"></i>}
              <span className="text-gray-500 text-[14px]"> • {post.timestamp}</span>
            </div>
          </div>
        </div>
        <button className="hover:text-gray-500 p-2 text-black">
          <i className="fa-solid fa-ellipsis text-sm"></i>
        </button>
      </div>

      {/* Media */}
      <div className="aspect-[4/5] w-full bg-black flex items-center justify-center relative cursor-pointer overflow-hidden group">
        {post.mediaType === 'video' ? (
          <>
            <video 
              ref={videoRef}
              src={post.videoUrl} 
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
              onClick={() => setIsMuted(!isMuted)}
            />
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
              className="absolute bottom-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center"
            >
              <i className={`fa-solid fa-volume-${isMuted ? 'xmark' : 'high'} text-xs`}></i>
            </button>
          </>
        ) : (
          <img src={post.imageUrl} alt="Post content" className="w-full h-full object-cover" onDoubleClick={toggleLike} />
        )}
      </div>

      {/* Actions */}
      <div className="px-3 pt-3 pb-4">
        <div className="flex justify-between mb-2">
          <div className="flex gap-4">
            <i onClick={toggleLike} className={`fa-${liked ? 'solid' : 'regular'} fa-heart text-2xl cursor-pointer transition-transform active:scale-125 ${liked ? 'text-[#ff3040]' : 'text-black'}`}></i>
            <i className="fa-regular fa-comment text-2xl cursor-pointer text-black"></i>
            <i className="fa-regular fa-paper-plane text-2xl cursor-pointer text-black"></i>
          </div>
          <i onClick={() => setSaved(!saved)} className={`fa-${saved ? 'solid' : 'regular'} fa-bookmark text-2xl cursor-pointer text-black`}></i>
        </div>

        <div className="font-bold text-[14px] mb-1 text-black">{likesCount.toLocaleString()} likes</div>
        
        <div className="text-[14px] text-black">
          {post.title && <div className="font-bold mb-0.5">{post.title}</div>}
          <span className="font-bold mr-2">{post.user.username}</span>
          <span className="font-normal">{post.caption}</span>
        </div>

        {post.externalLink && (
          <a 
            href={post.externalLink.startsWith('http') ? post.externalLink : `https://${post.externalLink}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
          >
            <i className="fa-solid fa-link"></i> Visit Link
          </a>
        )}
      </div>
    </div>
  );
};

export default PostCard;
