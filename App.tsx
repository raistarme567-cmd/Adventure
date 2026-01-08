
import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import PostCard from './components/PostCard';
import CreatePostModal from './components/CreatePostModal';
import { Post, Story } from './types';

// Components for new views
const SearchView = ({ posts, onBack }: { posts: Post[], onBack: () => void }) => {
  const [query, setQuery] = useState('');
  const filtered = posts.filter(p => 
    p.user.username.toLowerCase().includes(query.toLowerCase()) || 
    p.caption.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl px-4 py-6">
      <div className="relative mb-6">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input 
          autoFocus
          className="w-full bg-gray-100 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
          placeholder="Search creators, captions, or topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {filtered.map(p => (
          <div key={p.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
            <img src={p.imageUrl} className="w-full h-full object-cover" alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

const MessagesView = () => {
  const chats = [
    { id: '1', name: 'nature_daily', lastMsg: 'That view was amazing!', time: '2h', pic: 'https://picsum.photos/200/200?random=1' },
    { id: '2', name: 'tech_wizard', lastMsg: 'Did you see the new Gemini update?', time: '5h', pic: 'https://picsum.photos/200/200?random=3' },
    { id: '3', name: 'comedy_gold', lastMsg: '😂 lol so true', time: '1d', pic: 'https://i.pravatar.cc/150?u=comedy' },
  ];
  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col md:flex-row bg-white md:border rounded-xl overflow-hidden max-w-5xl">
      <div className="w-full md:w-80 border-r flex flex-col">
        <div className="p-5 border-b font-bold text-xl flex justify-between items-center text-black">
          gemini_user <i className="fa-regular fa-pen-to-square"></i>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(c => (
            <div key={c.id} className="p-4 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
              <img src={c.pic} className="w-12 h-12 rounded-full" alt="" />
              <div className="flex-1">
                <div className="font-semibold text-black">{c.name}</div>
                <div className="text-sm text-gray-500 truncate">{c.lastMsg} • {c.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-10">
        <div className="w-24 h-24 border-2 border-black rounded-full flex items-center justify-center mb-4">
          <i className="fa-regular fa-paper-plane text-4xl text-black"></i>
        </div>
        <h2 className="text-xl font-bold text-black">Your Messages</h2>
        <p className="text-gray-500">Send private photos and messages to a friend.</p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-bold">Send Message</button>
      </div>
    </div>
  );
};

const ExploreView = ({ posts }: { posts: Post[] }) => (
  <div className="w-full max-w-5xl px-4 py-6 grid grid-cols-3 gap-1 md:gap-4">
    {posts.map((p, i) => (
      <div key={p.id} className={`bg-gray-200 overflow-hidden relative group cursor-pointer rounded-lg ${i % 5 === 0 ? 'col-span-2 row-span-2' : ''}`}>
        <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
        {p.mediaType === 'video' && <i className="fa-solid fa-play absolute top-3 right-3 text-white drop-shadow-md"></i>}
      </div>
    ))}
  </div>
);

const ReelsView: React.FC<{ reels: Post[], onFollow: (id: string) => void, followedUsers: Set<string> }> = ({ reels, onFollow, followedUsers }) => {
  return (
    <div className="w-full h-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black flex flex-col items-center">
      {reels.map((reel, idx) => (
        <div key={`${reel.id}-${idx}`} className="w-full h-full md:w-[420px] md:h-[94vh] md:my-[3vh] flex-shrink-0 snap-start relative bg-black md:rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
          <video 
            src={reel.videoUrl} 
            className="w-full h-full object-cover"
            loop
            autoPlay
            muted={idx !== 0}
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 pointer-events-none" />
          <div className="absolute bottom-16 md:bottom-6 left-0 w-full p-4 text-white z-20">
            <div className="flex items-center gap-3 mb-3">
              <img src={reel.user.profilePic} className="w-9 h-9 rounded-full border-2 border-white object-cover" alt="" />
              <span className="font-bold text-[15px]">{reel.user.username}</span>
              <button 
                onClick={() => onFollow(reel.user.id)}
                className={`text-[12px] font-bold border-2 border-white px-3 py-1 rounded-lg transition-all active:scale-95 ${followedUsers.has(reel.user.id) ? 'bg-white/30 backdrop-blur-sm' : 'bg-transparent hover:bg-white hover:text-black'}`}
              >
                {followedUsers.has(reel.user.id) ? 'Following' : 'Follow'}
              </button>
            </div>
            {reel.title && <div className="font-bold text-sm mb-1">{reel.title}</div>}
            <p className="text-[14px] leading-snug line-clamp-2 mb-2 font-medium">{reel.caption}</p>
            <div className="flex items-center gap-2 text-[13px] opacity-90">
              <i className="fa-solid fa-music text-[10px]"></i>
              <span className="truncate">{reel.user.username} • Original Audio</span>
            </div>
          </div>
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6 text-white z-20">
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <i className="fa-regular fa-heart text-3xl drop-shadow-lg transition-transform group-active:scale-125"></i>
              <span className="text-[12px] font-bold">{(reel.likes / 1000).toFixed(1)}K</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <i className="fa-regular fa-comment text-3xl drop-shadow-lg"></i>
              <span className="text-[12px] font-bold">{reel.comments}</span>
            </div>
            <i className="fa-regular fa-paper-plane text-2xl drop-shadow-lg"></i>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProfileView: React.FC<{ posts: Post[], followers: number, following: number }> = ({ posts, followers, following }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');
  const filteredPosts = posts.filter(p => activeTab === 'reels' ? p.mediaType === 'video' : p.mediaType === 'image');

  return (
    <div className="w-full max-w-[935px] mt-4 px-4 pb-20">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-20 mb-10 text-black">
        <img src="https://picsum.photos/200/200?random=10" className="w-24 h-24 md:w-40 md:h-40 rounded-full border p-1" alt="" />
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-light">gemini_user</h2>
          <div className="flex gap-8">
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>{followers.toLocaleString()}</strong> followers</span>
            <span><strong>{following.toLocaleString()}</strong> following</span>
          </div>
          <p className="font-semibold">Gemini AI Lab • Creating amazing tech clones.</p>
        </div>
      </div>
      <div className="border-t flex justify-center gap-12 text-xs font-bold text-gray-400">
        <div onClick={() => setActiveTab('posts')} className={`py-4 cursor-pointer ${activeTab === 'posts' ? 'border-t border-black text-black' : ''}`}>POSTS</div>
        <div onClick={() => setActiveTab('reels')} className={`py-4 cursor-pointer ${activeTab === 'reels' ? 'border-t border-black text-black' : ''}`}>REELS</div>
      </div>
      <div className="grid grid-cols-3 gap-1 md:gap-4 mt-6">
        {filteredPosts.map(p => (
          <div key={p.id} className="aspect-square bg-gray-100 overflow-hidden rounded">
            <img src={p.imageUrl} className="w-full h-full object-cover" alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'profile' | 'reels' | 'search' | 'explore' | 'messages' | 'notifications'>('home');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [reels, setReels] = useState<Post[]>(REELS_DATA);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set(['u1']));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFollow = (userId: string) => {
    setFollowedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const renderContent = () => {
    switch (view) {
      case 'reels': return <ReelsView reels={reels} onFollow={toggleFollow} followedUsers={followedUsers} />;
      case 'profile': return <ProfileView posts={[...posts, ...reels]} followers={12800} following={482} />;
      case 'search': return <SearchView posts={[...posts, ...reels]} onBack={() => setView('home')} />;
      case 'explore': return <ExploreView posts={[...posts, ...reels]} />;
      case 'messages': return <MessagesView />;
      case 'notifications': return (
        <div className="w-full max-w-lg p-6 text-black">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-4 mb-4 p-2 hover:bg-gray-50 rounded-lg">
              <img src={`https://picsum.photos/50/50?random=${i+20}`} className="w-10 h-10 rounded-full" alt="" />
              <p className="flex-1 text-sm"><strong>user_{i}</strong> liked your photo. <span className="text-gray-400">2h</span></p>
              <img src={posts[0].imageUrl} className="w-10 h-10 rounded" alt="" />
            </div>
          ))}
        </div>
      );
      default: return (
        <div className="w-full max-w-[470px] flex flex-col items-center">
          {posts.map(post => <PostCard key={post.id} post={post} onFollow={() => toggleFollow(post.user.id)} isFollowing={followedUsers.has(post.user.id)} />)}
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar 
        onPostClick={() => setIsModalOpen(true)} 
        onProfileClick={() => setView('profile')}
        onHomeClick={() => setView('home')}
        onReelsClick={() => setView('reels')}
        onSearchClick={() => setView('search')}
        onExploreClick={() => setView('explore')}
        onMessagesClick={() => setView('messages')}
        onNotificationsClick={() => setView('notifications')}
        currentView={view}
      />
      <main className={`flex-1 w-full flex flex-col items-center ${view === 'reels' ? 'h-screen overflow-hidden' : 'pt-16 md:pt-8 md:pl-[72px] xl:pl-64'}`}>
        {renderContent()}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 w-full h-[55px] bg-white border-t flex items-center justify-around z-[60]">
        <i onClick={() => setView('home')} className={`fa-solid fa-house text-xl ${view === 'home' ? 'text-black' : 'text-gray-300'}`}></i>
        <i onClick={() => setView('explore')} className={`fa-solid fa-compass text-xl ${view === 'explore' ? 'text-black' : 'text-gray-300'}`}></i>
        <i onClick={() => setView('reels')} className={`fa-solid fa-clapperboard text-xl ${view === 'reels' ? 'text-black' : 'text-gray-300'}`}></i>
        <i onClick={() => setIsModalOpen(true)} className="fa-regular fa-square-plus text-xl text-gray-300"></i>
        <div onClick={() => setView('profile')} className={`w-7 h-7 rounded-full border overflow-hidden ${view === 'profile' ? 'border-black' : 'border-gray-200'}`}>
          <img src="https://picsum.photos/100/100?random=10" alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPost={(p) => { 
        if(p.mediaType === 'video') setReels([p, ...reels]); else setPosts([p, ...posts]); 
        setView(p.mediaType === 'video' ? 'reels' : 'home');
      }} />
    </div>
  );
};

const REELS_DATA: Post[] = [
  { id: 'r1', user: { id: 'u10', username: 'comedy_center', profilePic: 'https://i.pravatar.cc/150?u=comedy' }, imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-funny-cat-licking-a-glass-window-41584-large.mp4', mediaType: 'video', caption: 'Typical Monday 😂 #comedy', likes: 12000, comments: 450, timestamp: '1h ago' },
  { id: 'r2', user: { id: 'u11', username: 'pro_gamer', profilePic: 'https://i.pravatar.cc/150?u=gaming' }, imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-43527-large.mp4', mediaType: 'video', caption: 'GG EZ! 🎮 #gaming', likes: 45000, comments: 1200, timestamp: '2h ago' },
];

const INITIAL_POSTS: Post[] = [
  { id: 'p1', user: { id: 'u1', username: 'nature_daily', profilePic: 'https://picsum.photos/200/200?random=1', isVerified: true }, imageUrl: 'https://picsum.photos/600/600?random=11', mediaType: 'image', caption: 'Beautiful view from the hike today! 🌲 #nature', likes: 1240, comments: 42, timestamp: '5h ago' },
  { id: 'p2', user: { id: 'u2', username: 'tech_expert', profilePic: 'https://picsum.photos/200/200?random=3' }, imageUrl: 'https://picsum.photos/600/600?random=15', mediaType: 'image', caption: 'The future is here. 🚀 #tech', likes: 850, comments: 12, timestamp: '8h ago' },
];

export default App;
