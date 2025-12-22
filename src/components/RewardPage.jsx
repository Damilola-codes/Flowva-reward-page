import { useState } from 'react'
import {
  FaArrowRight,
  FaBook,
  FaClock,
  FaCode,
  FaFire,
  FaGift,
  FaHeart,
  FaLightbulb,
  FaLink,
  FaSignOutAlt,
  FaMusic,
  FaPalette,
  FaPlus,
  FaRunning,
  FaShareAlt,
  FaStar,
  FaTimes,
  FaTrophy,
  FaUsers,
} from 'react-icons/fa'
import RewardCard from './RewardCard'
import CongratsModal from './CongratsModal'
import { useRewards } from '../hooks/useRewards'
import { useAuth } from '../contexts/AuthContext'
import './RewardPage.css'

function RewardPage() {
  const rewardIcons = {
    running: FaRunning,
    book: FaBook,
    heart: FaHeart,
    code: FaCode,
    palette: FaPalette,
    music: FaMusic,
    lightbulb: FaLightbulb,
    star: FaStar,
    trophy: FaTrophy,
    fire: FaFire,
    users: FaUsers,
  }

  const redeemables = [
    {
      id: 'gift-card',
      title: '$5 Gift Card',
      description: 'A quick win for coffee, snacks, or small treats.',
      cost: 500,
      icon: FaGift,
      iconColor: '#ec4899',
      tag: 'Popular',
    },
    {
      id: 'workspace-pro',
      title: 'Flowva Pro Week',
      description: 'Unlock automation boosts, priority support, and faster syncs.',
      cost: 1200,
      icon: FaStar,
      iconColor: '#f59e0b',
      tag: 'Team pick',
    },
    {
      id: 'team-credit',
      title: 'Team Credit ($25)',
      description: 'Give the crew a shared credit for tools or swag.',
      cost: 1800,
      icon: FaUsers,
      iconColor: '#3b82f6',
    },
    {
      id: 'donation',
      title: 'Give Back',
      description: 'Donate points to climate or open-source funds.',
      cost: 700,
      icon: FaHeart,
      iconColor: '#ef4444',
    },
    {
      id: 'virtual-visa',
      title: '$5 Virtual Visa Card',
      description: 'Shop anywhere Visa is accepted online.',
      cost: 500,
      icon: FaGift,
      iconColor: '#8b5cf6',
    },
    {
      id: 'bank-transfer',
      title: '$5 Bank Transfer',
      description: 'Transfer $5 equivalent to your bank account.',
      cost: 500,
      icon: FaGift,
      iconColor: '#10b981',
    },
    {
      id: 'paypal-international',
      title: '$5 PayPal International',
      description: 'Receive a $5 PayPal balance transfer directly.',
      cost: 500,
      icon: FaGift,
      iconColor: '#0ea5e9',
    },
    {
      id: 'coming-soon-badge',
      title: 'Merch Drop',
      description: 'Exclusive Flowva swag — limited run.',
      cost: 2000,
      icon: FaTrophy,
      iconColor: '#f59e0b',
      comingSoon: true,
    },
  ]

  const referralLink = 'https://flowvahub.com/signup?ref=damil8014'
  const { signOut, user } = useAuth()
  const {
    rewards,
    loading: rewardsLoading,
    error: rewardsError,
    addReward,
    claimDaily,
    updateReward,
    deleteReward,
    redeem,
    totals,
  } = useRewards()

  const [activeTab, setActiveTab] = useState('earn')
  const [copied, setCopied] = useState(false)
  const [redeemFilter, setRedeemFilter] = useState('all')

  const [showModal, setShowModal] = useState(false)
  const [newReward, setNewReward] = useState({
    title: '',
    description: '',
    points: '',
    icon: 'star',
  })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  
  // Congrats modal state
  const [showCongrats, setShowCongrats] = useState(false)
  const [claimResult, setClaimResult] = useState({ streak: 0, points: 5 })
  const [claiming, setClaiming] = useState(false)

  const totalPoints = totals.balance || 0
  const completedWins = totals.completedWins || 0
  const currentStreak = totals.currentStreak || 0
  const avgPointsPerDay = totals.avgPointsPerDay || 0
  const levelGoal = 1500
  const levelProgress = Math.min((totalPoints / levelGoal) * 100, 100)

  // Handle daily claim with congrats modal
  const handleDailyClaim = async () => {
    if (claiming) return
    
    try {
      setClaiming(true)
      const result = await claimDaily()
      
      if (result.error) {
        if (result.error.message.includes('Already claimed')) {
          alert('You\'ve already claimed your daily reward today! Come back tomorrow.')
        } else {
          alert('Failed to claim daily reward. Please try again.')
        }
        return
      }
      
      // Show congrats modal with streak info
      setClaimResult({
        streak: result.streak || 1,
        points: 5,
      })
      setShowCongrats(true)
    } catch (err) {
      console.error('Error claiming daily:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setClaiming(false)
    }
  }

  const handleAddReward = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!newReward.title.trim()) return
    try {
      setSaving(true)
      const payload = {
        ...newReward,
        completed: false,
        date: new Date().toISOString().split('T')[0],
        points: parseInt(newReward.points, 10) || 0,
      }
      const { error } = await addReward(payload)
      if (error) {
        setFormError(error.message || 'Unable to save reward')
        return
      }
      setNewReward({ title: '', description: '', points: '', icon: 'star' })
      setShowModal(false)
    } finally {
      setSaving(false)
    }
  }

  const handleCompleteReward = async (id) => {
    const current = rewards.find((reward) => reward.id === id)
    if (!current) return
    await updateReward(id, { completed: !current.completed })
  }

  const handleDeleteReward = async (id) => {
    await deleteReward(id)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch (err) {
      setCopied(false)
    }
  }

  const getFilteredRedeemables = () => {
    switch (redeemFilter) {
      case 'unlocked':
        return redeemables.filter((i) => !i.comingSoon && totals.balance >= i.cost)
      case 'locked':
        return redeemables.filter((i) => !i.comingSoon && totals.balance < i.cost)
      case 'coming':
        return redeemables.filter((i) => i.comingSoon)
      case 'all':
      default:
        return redeemables
    }
  }

  return (
    <div className="reward-page">
      <div className="ambient ambient-one" aria-hidden="true"></div>
      <div className="ambient ambient-two" aria-hidden="true"></div>

      <header className="reward-hero container">
        <div className="hero-copy">
          <p className="eyebrow">Flowva Rewards</p>
          <h1>Reward the work that moves the team forward.</h1>
          <p className="lede">
            Flowva keeps momentum high with points for shipped work, thoughtful
            referrals, and consistent focus habits.
          </p>
          <div className="hero-chips">
            <span className="chip">
              <FaTrophy size={14} /> {totalPoints} pts
            </span>
            <span className="chip">
              <FaClock size={14} /> {currentStreak}-day streak
            </span>
            <span className="chip soft">Beta access</span>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-header">
            <div className="balance-info">
              <p className="muted">Current balance</p>
              <h2>{totalPoints} pts</h2>
            </div>
            <div className="panel-right">
              <button onClick={signOut} className="logout-button" type="button">
                <FaSignOutAlt size={16} /> Logout
              </button>
              <button
                type="button"
                className="ghost-btn log-btn"
                onClick={() => setShowModal(true)}
              >
                <FaPlus size={14} /> Log progress
              </button>
            </div>
          </div>
          <div className="panel-progress">
            <div className="progress-head">
              <span>Next unlock</span>
              <span>{levelGoal} pts</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
            <p className="muted">
              Keep your streak alive and refer a teammate to jump the queue.
            </p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="tab-bar" role="tablist" aria-label="Rewards views">
          <button
            className={`tab-pill ${activeTab === 'earn' ? 'active' : ''}`}
            onClick={() => setActiveTab('earn')}
            role="tab"
            aria-selected={activeTab === 'earn'}
          >
            Earn Points
          </button>
          <button
            className={`tab-pill ${activeTab === 'redeem' ? 'active' : ''}`}
            onClick={() => setActiveTab('redeem')}
            role="tab"
            aria-selected={activeTab === 'redeem'}
          >
            Redeem Rewards
          </button>
        </div>

        {rewardsError ? (
          <div className="alert error" role="alert">
            {rewardsError}
          </div>
        ) : null}

        {activeTab === 'earn' ? (
          <>
            <section className="stat-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaStar size={18} />
                </div>
                <div>
                  <p className="muted">Completed wins</p>
                  <h3>
                    {rewardsLoading ? '…' : completedWins}
                  </h3>
                  <span className="pill subtle">All time</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon alt">
                  <FaFire size={18} />
                </div>
                <div>
                  <p className="muted">Streak</p>
                  <h3>{rewardsLoading ? '…' : `${currentStreak} days`}</h3>
                  <span className="pill subtle">Keep it going!</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon neutral">
                  <FaClock size={18} />
                </div>
                <div>
                  <p className="muted">Avg. points / day</p>
                  <h3>{rewardsLoading ? '…' : `${parseFloat(avgPointsPerDay).toFixed(1)} pts`}</h3>
                  <span className="pill subtle">Since signup</span>
                </div>
              </div>
            </section>

            {/* Daily Focus Section */}
            <section>
              <div className="section-header">
                <div className="section-header-bar"></div>
                <h2>Daily Focus</h2>
              </div>

              <div className="daily-focus-card">
                <div className="daily-focus-header">
                  <div className="daily-focus-top">
                    <div className="daily-focus-info">
                      <h3>Claim today&apos;s points</h3>
                      <p>Mark a block as honored to add +5 pts.</p>
                    </div>
                    <button
                      type="button"
                      className="claim-button"
                      onClick={handleDailyClaim}
                      disabled={claiming || rewardsLoading}
                    >
                      {claiming ? 'Claiming...' : 'Claim +5'}
                    </button>
                  </div>
                </div>

                <div className="week-capsules" aria-hidden="true">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                    // Get current day of week (0 = Sunday, 1 = Monday, etc.)
                    const today = new Date().getDay()
                    // Convert to Monday = 0 format
                    const adjustedToday = today === 0 ? 6 : today - 1
                    const isToday = idx === adjustedToday
                    const isPast = idx < adjustedToday
                    
                    return (
                      <span
                        key={`${day}-${idx}`}
                        className={`day-capsule ${isToday ? 'active' : ''} ${isPast && currentStreak > idx ? 'completed' : ''}`}
                      >
                        {day}
                      </span>
                    )
                  })}
                </div>

                <p className="daily-focus-note">
                  {currentStreak > 0 
                    ? `🔥 ${currentStreak} day streak! Keep it going and unlock bonus multipliers.`
                    : 'Keep the streak and unlock bonus multipliers on Fridays.'}
                </p>
              </div>
            </section>

            {/* Earn More Points Section */}
            <section>
              <div className="section-header">
                <div className="section-header-bar"></div>
                <h2>Earn More Points</h2>
              </div>
              
              <div className="earn-more-grid">
                {/* Refer and Win Card */}
                <div className="earn-card">
                  <div className="earn-card-header">
                    <div className="earn-icon-box">
                      <FaStar size={18} />
                    </div>
                    <span className="earn-card-title">Refer and win 10,000 points!</span>
                  </div>
                  <p className="earn-card-desc">
                    Invite 3 friends by Nov 20 and earn a chance to be one of 5 winners of <span className="highlight">10,000 points</span>. Friends must complete onboarding to qualify.
                  </p>
                </div>

                {/* Share Your Stack Card */}
                <div className="earn-card">
                  <div className="earn-card-header">
                    <div className="earn-icon-box">
                      <FaShareAlt size={18} />
                    </div>
                    <div>
                      <div className="earn-card-title">Share Your Stack</div>
                      <div className="earn-card-subtitle">Earn +25 pts</div>
                    </div>
                  </div>
                  <div className="earn-card-footer">
                    <span>Share your tool stack</span>
                    <button className="share-button">
                      <FaShareAlt size={14} />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Refer & Earn Section */}
            <section>
              <div className="section-header">
                <div className="section-header-bar"></div>
                <h2>Refer & Earn</h2>
              </div>

              <div className="refer-earn-card">
                <div className="refer-header">
                  <div className="refer-icon-box">
                    <FaUsers size={18} />
                  </div>
                  <div className="refer-header-text">
                    <h3>Share Your Link</h3>
                    <p>Invite friends and earn 25 points when they join!</p>
                  </div>
                </div>

                <div className="refer-link-box">
                  <FaLink size={14} />
                  <span className="refer-link-text">{referralLink}</span>
                  <button
                    type="button"
                    className="copy-button"
                    onClick={handleCopyLink}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="refer-stats">
                  <div className="refer-stat">
                    <p className="refer-stat-value">0</p>
                    <p className="refer-stat-label">Referrals</p>
                  </div>
                  <div className="refer-stat">
                    <p className="refer-stat-value">0</p>
                    <p className="refer-stat-label">Points Earned</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rewards-section">
              <div className="section-top">
                <div>
                  <p className="eyebrow">Activity</p>
                  <h2>Recent wins</h2>
                </div>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => setShowModal(true)}
                >
                  <FaPlus size={14} /> Log another win
                </button>
              </div>

              {rewardsLoading ? (
                <div className="empty-state">
                  <p>Loading your wins...</p>
                </div>
              ) : rewards.length === 0 ? (
                <div className="empty-state">
                  <p>No rewards yet. Create your first reward to get started!</p>
                </div>
              ) : (
                <div className="rewards-grid">
                  {rewards.map((reward) => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      onComplete={handleCompleteReward}
                      onDelete={handleDeleteReward}
                      iconMap={rewardIcons}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="redeem-section">
            <div className="section-top">
              <div>
                <p className="eyebrow">Shop</p>
                <h2>Redeem your Flowva points</h2>
                <p className="muted">
                  Choose perks that keep momentum high—personal treats or team boosts.
                </p>
              </div>
            </div>
            <div className="redeem-filters">
              {(() => {
                const unlockedCount = redeemables.filter(
                  (i) => !i.comingSoon && totals.balance >= i.cost
                ).length
                const lockedCount = redeemables.filter(
                  (i) => !i.comingSoon && totals.balance < i.cost
                ).length
                const comingCount = redeemables.filter((i) => i.comingSoon).length
                return (
                  <div className="pill-row">
                    <button
                      type="button"
                      className={`pill subtle ${redeemFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setRedeemFilter('all')}
                    >
                      All Rewards {redeemables.length}
                    </button>
                    <button
                      type="button"
                      className={`pill subtle ${redeemFilter === 'unlocked' ? 'active' : ''}`}
                      onClick={() => setRedeemFilter('unlocked')}
                    >
                      Unlocked {unlockedCount}
                    </button>
                    <button
                      type="button"
                      className={`pill subtle ${redeemFilter === 'locked' ? 'active' : ''}`}
                      onClick={() => setRedeemFilter('locked')}
                    >
                      Locked {lockedCount}
                    </button>
                    <button
                      type="button"
                      className={`pill subtle ${redeemFilter === 'coming' ? 'active' : ''}`}
                      onClick={() => setRedeemFilter('coming')}
                    >
                      Coming Soon {comingCount}
                    </button>
                  </div>
                )
              })()}
            </div>

            <div className="redeem-grid">
              {getFilteredRedeemables().map(({ id, title, description, cost, icon: Icon, iconColor, tag, comingSoon }) => {
                const isLocked = !comingSoon && totals.balance < cost
                const isUnlocked = !comingSoon && totals.balance >= cost
                
                return (
                  <div key={id} className={`redeem-card ${comingSoon ? 'is-coming' : ''} ${isLocked ? 'is-locked' : ''}`}>
                    {tag && <span className="card-tag">{tag}</span>}
                    <div className="redeem-icon" style={{ color: iconColor }}>
                      <Icon size={22} />
                    </div>
                    <div className="redeem-body">
                      <h3 className="redeem-title">{title}</h3>
                      <p className="redeem-desc">{description}</p>
                      <div className="redeem-meta">
                        <span className="cost">{cost} pts</span>
                        {comingSoon && <span className="status-badge coming-soon">Coming Soon</span>}
                        {isLocked && <span className="status-badge locked">Locked</span>}
                        {isUnlocked && <span className="status-badge unlocked">Unlocked</span>}
                      </div>
                      <div className="redeem-action">
                        {comingSoon ? (
                          <button type="button" className="redeem-btn disabled" disabled>
                            Coming Soon
                          </button>
                        ) : isUnlocked ? (
                          <button
                            type="button"
                            className="redeem-btn"
                            onClick={async () => {
                              await redeem({ item_id: id, title, cost })
                            }}
                          >
                            Claim <FaArrowRight size={12} />
                          </button>
                        ) : (
                          <button type="button" className="redeem-btn disabled" disabled>
                            Need {cost - totals.balance} more pts
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create a win</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <FaTimes size={22} />
              </button>
            </div>
            <form onSubmit={handleAddReward} className="reward-form">
              <div className="form-group">
                <label>Reward Icon</label>
                <div className="icon-selector">
                  {[
                    { key: 'star', Icon: FaStar },
                    { key: 'trophy', Icon: FaTrophy },
                    { key: 'fire', Icon: FaFire },
                    { key: 'heart', Icon: FaHeart },
                    { key: 'code', Icon: FaCode },
                    { key: 'palette', Icon: FaPalette },
                    { key: 'music', Icon: FaMusic },
                    { key: 'lightbulb', Icon: FaLightbulb },
                  ].map(({ key, Icon }) => (
                    <button
                      key={key}
                      type="button"
                      className={`icon-button ${
                        newReward.icon === key ? 'selected' : ''
                      }`}
                      onClick={() => setNewReward({ ...newReward, icon: key })}
                      title={key}
                    >
                      <Icon size={26} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  placeholder="What did you ship?"
                  value={newReward.title}
                  onChange={(e) =>
                    setNewReward({ ...newReward, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Details</label>
                <textarea
                  id="description"
                  placeholder="Add context so the team can celebrate with you."
                  value={newReward.description}
                  onChange={(e) =>
                    setNewReward({ ...newReward, description: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="form-group inline">
                <div>
                  <label htmlFor="points">Points</label>
                  <input
                    id="points"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newReward.points}
                    onChange={(e) =>
                      setNewReward({ ...newReward, points: e.target.value })
                    }
                  />
                </div>
              </div>

              {formError ? <div className="alert error">{formError}</div> : null}

              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button" disabled={saving}>
                  {saving ? 'Saving...' : 'Save win'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Congratulations Modal */}
      <CongratsModal
        isOpen={showCongrats}
        onClose={() => setShowCongrats(false)}
        streak={claimResult.streak}
        points={claimResult.points}
      />

      <footer className="reward-footer">
        <p>Stay in flow. Reward the habits that keep your team moving. 🚀</p>
      </footer>
    </div>
  )
}

export default RewardPage
