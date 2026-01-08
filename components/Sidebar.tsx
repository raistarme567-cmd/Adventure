
import React, { useState } from 'react';

const NavItem = ({ icon, label, active = false, badge, className = "", onClick }: { icon: string, label: string, active?: boolean, badge?: string, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`group flex items-center gap-4 p-3 my-1 rounded-lg cursor-pointer hover:bg-black/5 transition-all relative ${active ? 'font-bold' : 'font-normal'} ${className}`}
  >
    <div className="relative text-black">
      <i className={`${icon} text-2xl transition-transform group-hover:scale-105`}></i>
      {badge && (
        <span className="absolute -top-1.5 -right-1.5 bg-[#ff3040] text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white">
          {badge}
        </span>
      )}
    </div>
    <span className="hidden xl:block text-[16px] tracking-tight text-black">{label}</span>
  </div>
);

interface SidebarProps {
  onPostClick: () => void;
  onProfileClick: () => void;
  onHomeClick: () => void;
  onReelsClick: () => void;
  onSearchClick: () => void;
  onExploreClick: () => void;
  onMessagesClick: () => void;
  onNotificationsClick: () => void;
  currentView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onPostClick, onProfileClick, onHomeClick, onReelsClick, 
  onSearchClick, onExploreClick, onMessagesClick, onNotificationsClick,
  currentView 
}) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="hidden md:flex flex-col fixed left-0 top-0 h-screen border-r border-gray-200 bg-white w-[72px] xl:w-64 px-3 py-5 z-50">
      <div className="mb-10 px-3 h-10 flex items-center">
        <h1 onClick={onHomeClick} className="hidden xl:block text-2xl font-bold italic tracking-tighter cursor-pointer text-black">InstaGemini</h1>
        <i onClick={onHomeClick} className="fa-brands fa-instagram text-2xl xl:hidden cursor-pointer hover:scale-110 transition-transform text-black"></i>
      </div>
      
      <div className="flex-1 flex flex-col">
        <NavItem icon="fa-solid fa-house" label="Home" active={currentView === 'home'} onClick={onHomeClick} />
        <NavItem icon="fa-solid fa-magnifying-glass" label="Search" active={currentView === 'search'} onClick={onSearchClick} />
        <NavItem icon="fa-regular fa-compass" label="Explore" active={currentView === 'explore'} onClick={onExploreClick} />
        <NavItem icon="fa-solid fa-clapperboard" label="Reels" active={currentView === 'reels'} onClick={onReelsClick} />
        <NavItem icon="fa-regular fa-paper-plane" label="Messages" badge="3" active={currentView === 'messages'} onClick={onMessagesClick} />
        <NavItem icon="fa-regular fa-heart" label="Notifications" active={currentView === 'notifications'} onClick={onNotificationsClick} />
        <NavItem icon="fa-regular fa-square-plus" label="Create" onClick={onPostClick} />
        
        <div onClick={onProfileClick} className={`flex items-center gap-4 p-3 my-1 rounded-lg cursor-pointer hover:bg-black/5 transition-all ${currentView === 'profile' ? 'font-bold' : ''}`}>
          <div className={`w-6 h-6 rounded-full overflow-hidden border ${currentView === 'profile' ? 'border-black border-2' : 'border-gray-300'}`}>
            <img src="https://picsum.photos/150/150?random=10" className="w-full h-full object-cover" alt="Profile" />
          </div>
          <span className="hidden xl:block text-[16px] tracking-tight text-black">Profile</span>
        </div>
      </div>

      <div className="mt-auto relative">
        {showMore && (
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white shadow-[0_0_20px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden py-2 border border-gray-100">
            <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 text-black">
              <i className="fa-solid fa-gear"></i> <span>Settings</span>
            </div>
            <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 text-black">
              <i className="fa-solid fa-chart-line"></i> <span>Your activity</span>
            </div>
            <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-red-500 border-t">
              Log out
            </div>
          </div>
        )}
        <NavItem 
          icon="fa-solid fa-bars" 
          label="More" 
          active={showMore}
          onClick={() => setShowMore(!showMore)} 
        />
      </div>
    </div>
  );
};

export default Sidebar;
