// src/components/MainContent.jsx
import VideoFeed from './VideoFeed';
import InteractionPanel from './InteractionPanel';

const MainContent = (props) => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 border border-gray-700 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <VideoFeed />
      <InteractionPanel {...props} />
    </div>
  );
};

export default MainContent;