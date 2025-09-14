// src/components/InteractionPanel.jsx
import StatusDisplay from './StatusDisplay';
import AgentResponse from './AgentResponse';

const InteractionPanel = ({ emotion, status, message, isLoading }) => {
  return (
    <div className="flex flex-col justify-between space-y-6">
      <StatusDisplay emotion={emotion} status={status} />
      <AgentResponse message={message} isLoading={isLoading} />
    </div>
  );
};

export default InteractionPanel;