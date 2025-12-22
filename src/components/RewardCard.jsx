import { FaCheckCircle, FaTrash } from 'react-icons/fa'
import './RewardCard.css'

function RewardCard({ reward, onComplete, onDelete, iconMap }) {
  const IconComponent = iconMap[reward.icon]

  return (
    <div className={`reward-card ${reward.completed ? 'completed' : ''}`}>
      <div className="reward-card-header">
        <div className="reward-icon">
          {IconComponent ? <IconComponent size={36} /> : null}
        </div>
        <div className="reward-actions">
          <button
            onClick={() => onComplete(reward.id)}
            className={`action-button check-button ${
              reward.completed ? 'completed' : ''
            }`}
            title={reward.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <FaCheckCircle size={18} />
          </button>
          <button
            onClick={() => onDelete(reward.id)}
            className="action-button delete-button"
            title="Delete reward"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>

      <div className="reward-card-content">
        <h3 className="reward-title">{reward.title}</h3>
        <p className="reward-description">{reward.description}</p>

        <div className="reward-footer">
          <div className="reward-points">
            <span className="points-label">Points</span>
            <span className="points-value">{reward.points}</span>
          </div>
          <div className="reward-date">{reward.date}</div>
        </div>
      </div>

      {reward.completed && <div className="completed-badge">Completed ✨</div>}
    </div>
  )
}

export default RewardCard
