import { FaTrophy, FaFire, FaTimes } from 'react-icons/fa'
import './CongratsModal.css'

const CongratsModal = ({ isOpen, onClose, streak, points }) => {
  if (!isOpen) return null

  return (
    <div className="congrats-overlay" onClick={onClose}>
      <div className="congrats-modal" onClick={(e) => e.stopPropagation()}>
        <button className="congrats-close" onClick={onClose} type="button">
          <FaTimes />
        </button>

        <div className="congrats-content">
          <div className="congrats-icon-wrapper">
            <div className="congrats-icon pulse">
              <FaTrophy size={48} />
            </div>
            <div className="congrats-particles">
              <span className="particle">✨</span>
              <span className="particle">⭐</span>
              <span className="particle">💫</span>
              <span className="particle">🎉</span>
              <span className="particle">✨</span>
              <span className="particle">⭐</span>
            </div>
          </div>

          <h2 className="congrats-title">Congratulations!</h2>
          <p className="congrats-message">
            You&apos;ve earned <strong>+{points} points</strong> for today&apos;s focus session
          </p>

          <div className="congrats-streak">
            <FaFire className="streak-icon" />
            <div className="streak-info">
              <p className="streak-number">{streak} Day Streak!</p>
              <p className="streak-text">Keep it going! Come back tomorrow.</p>
            </div>
          </div>

          <div className="congrats-progress">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '100%' }}></div>
            </div>
            <p className="progress-label">Daily goal completed</p>
          </div>

          <button
            className="congrats-button"
            onClick={onClose}
            type="button"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  )
}

export default CongratsModal
