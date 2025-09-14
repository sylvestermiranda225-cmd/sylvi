 
const AgentResponse = ({ message, isLoading }) => {
  return (
    <div className="bg-gray-900/70 rounded-lg p-6 min-h-[200px] flex flex-col justify-center border border-gray-700">
      <p className="text-sm font-semibold text-cyan-400 mb-2">AVA SAYS:</p>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
          <span className="text-gray-400">Thinking...</span>
        </div>
      ) : (
        <p className="text-lg text-gray-200 leading-relaxed">{message}</p>
      )}
    </div>
  );
};

export default AgentResponse;