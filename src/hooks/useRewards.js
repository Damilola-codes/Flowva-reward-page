import { useEffect, useMemo, useState } from 'react'
import { supabase, hasSupabaseConfig } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export const useRewards = () => {
  const { user } = useAuth()
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [redemptions, setRedemptions] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [dailyClaims, setDailyClaims] = useState([])
  const [canClaimToday, setCanClaimToday] = useState(true)

  // Fetch user profile
  const fetchUserProfile = async () => {
    if (!user || !hasSupabaseConfig || !supabase) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: insertError } = await supabase
            .from('user_profiles')
            .insert([{ id: user.id, signup_date: new Date().toISOString() }])
            .select()
            .single()

          if (insertError) throw insertError
          setUserProfile(newProfile)
        } else {
          throw error
        }
      } else {
        setUserProfile(data)
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
    }
  }

  // Fetch daily claims
  const fetchDailyClaims = async () => {
    if (!user || !hasSupabaseConfig || !supabase) return

    try {
      const { data, error } = await supabase
        .from('daily_claims')
        .select('*')
        .eq('user_id', user.id)
        .order('claim_date', { ascending: false })

      if (error) throw error
      setDailyClaims(data || [])

      // Check if user has already claimed today
      const today = new Date().toISOString().split('T')[0]
      const claimedToday = (data || []).some(
        (claim) => claim.claim_date === today
      )
      setCanClaimToday(!claimedToday)
    } catch (err) {
      console.error('Error fetching daily claims:', err)
    }
  }

  // Calculate streak
  const calculateStreak = (claims) => {
    if (!claims || claims.length === 0) return 0

    const sortedClaims = [...claims].sort(
      (a, b) => new Date(b.claim_date) - new Date(a.claim_date)
    )

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const claim of sortedClaims) {
      const claimDate = new Date(claim.claim_date)
      claimDate.setHours(0, 0, 0, 0)

      const daysDiff = Math.floor(
        (currentDate - claimDate) / (1000 * 60 * 60 * 24)
      )

      if (daysDiff === streak || (streak === 0 && daysDiff === 0)) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (daysDiff > streak) {
        break
      }
    }

    return streak
  }

  // Fetch rewards for current user
  const fetchRewards = async () => {
    if (!user || !hasSupabaseConfig || !supabase) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRewards(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching rewards:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch redemptions for current user
  const fetchRedemptions = async () => {
    if (!user || !hasSupabaseConfig || !supabase) return
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('redemptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRedemptions(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching redemptions:', err)
    } finally {
      setLoading(false)
    }
  }

  // Add a new reward
  const addReward = async (rewardData) => {
    if (!user || !hasSupabaseConfig || !supabase)
      return { data: null, error: new Error('Supabase not configured') }

    try {
      const { data, error } = await supabase.from('rewards').insert([
        {
          ...rewardData,
          user_id: user.id,
        },
      ])

      if (error) throw error
      await fetchRewards()
      await updateUserStats()
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    }
  }

  // Enhanced daily claim with streak tracking
  const claimDaily = async () => {
    if (!user || !hasSupabaseConfig || !supabase)
      return {
        data: null,
        error: new Error('Supabase not configured'),
        streak: 0,
      }

    if (!canClaimToday) {
      return {
        data: null,
        error: new Error('Already claimed today'),
        streak: 0,
      }
    }

    try {
      const today = new Date().toISOString().split('T')[0]
      const currentStreak = calculateStreak(dailyClaims) + 1

      // Insert daily claim record
      const { data: claimData, error: claimError } = await supabase
        .from('daily_claims')
        .insert([
          {
            user_id: user.id,
            claim_date: today,
            points_awarded: 5,
            streak_day: currentStreak,
          },
        ])
        .select()
        .single()

      if (claimError) throw claimError

      // Add reward for the claim
      await addReward({
        title: 'Daily focus',
        description: `Day ${currentStreak} - Honored a deep work block`,
        points: 5,
        icon: 'fire',
        completed: true,
      })

      // Update user profile with new streak
      await supabase
        .from('user_profiles')
        .update({
          current_streak: currentStreak,
          longest_streak: Math.max(
            currentStreak,
            userProfile?.longest_streak || 0
          ),
          last_claim_date: today,
        })
        .eq('id', user.id)

      await fetchDailyClaims()
      await fetchUserProfile()
      await fetchRewards()

      return { data: claimData, error: null, streak: currentStreak }
    } catch (err) {
      setError(err.message)
      console.error('Error claiming daily reward:', err)
      return { data: null, error: err, streak: 0 }
    }
  }

  // Update user stats
  const updateUserStats = async () => {
    if (!user || !hasSupabaseConfig || !supabase) return

    try {
      const completedRewards = rewards.filter((r) => r.completed)
      const totalPoints = rewards.reduce((sum, r) => sum + (r.points || 0), 0)

      const signupDate = new Date(userProfile?.signup_date || new Date())
      const daysSinceSignup = Math.max(
        1,
        Math.floor((Date.now() - signupDate) / (1000 * 60 * 60 * 24))
      )
      const avgPointsPerDay = (totalPoints / daysSinceSignup).toFixed(2)

      await supabase
        .from('user_profiles')
        .update({
          completed_wins: completedRewards.length,
          avg_points_per_day: avgPointsPerDay,
        })
        .eq('id', user.id)

      await fetchUserProfile()
    } catch (err) {
      console.error('Error updating user stats:', err)
    }
  }

  // Update login tracking
  const trackLogin = async () => {
    if (!user || !hasSupabaseConfig || !supabase) return

    try {
      const today = new Date().toISOString().split('T')[0]
      const lastLogin = userProfile?.last_login_date

      // Only update if it's a new day
      if (lastLogin !== today) {
        await supabase
          .from('user_profiles')
          .update({
            last_login_date: today,
            total_logins: (userProfile?.total_logins || 0) + 1,
          })
          .eq('id', user.id)

        await fetchUserProfile()
      }
    } catch (err) {
      console.error('Error tracking login:', err)
    }
  }

  // Update a reward
  const updateReward = async (rewardId, updates) => {
    try {
      if (!user || !hasSupabaseConfig || !supabase)
        return { data: null, error: new Error('Supabase not configured') }
      const { data, error } = await supabase
        .from('rewards')
        .update(updates)
        .eq('id', rewardId)
        .eq('user_id', user.id)

      if (error) throw error
      await fetchRewards()
      await updateUserStats()
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    }
  }

  // Delete a reward
  const deleteReward = async (rewardId) => {
    try {
      if (!user || !hasSupabaseConfig || !supabase)
        return { error: new Error('Supabase not configured') }
      const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', rewardId)
        .eq('user_id', user.id)

      if (error) throw error
      await fetchRewards()
      await updateUserStats()
      return { error: null }
    } catch (err) {
      setError(err.message)
      return { error: err }
    }
  }

  // Create a redemption
  const redeem = async ({ item_id, title, cost }) => {
    try {
      if (!user || !hasSupabaseConfig || !supabase)
        return { data: null, error: new Error('Supabase not configured') }
      const { data, error } = await supabase.from('redemptions').insert([
        {
          user_id: user.id,
          item_id,
          item_title: title,
          points_spent: cost,
          status: 'completed',
        },
      ])
      if (error) throw error
      await fetchRedemptions()
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    }
  }

  // Derived totals with user profile stats
  const totals = useMemo(() => {
    const totalEarned = (rewards || []).reduce(
      (sum, r) => sum + (Number(r.points) || 0),
      0
    )
    const totalRedeemed = (redemptions || []).reduce(
      (sum, r) => sum + (Number(r.points_spent) || 0),
      0
    )
    const balance = Math.max(0, totalEarned - totalRedeemed)
    const currentStreak = calculateStreak(dailyClaims)
    const completedWins = userProfile?.completed_wins || 0
    const avgPointsPerDay = userProfile?.avg_points_per_day || 0

    return {
      totalEarned,
      totalRedeemed,
      balance,
      currentStreak,
      completedWins,
      avgPointsPerDay,
    }
  }, [rewards, redemptions, userProfile, dailyClaims])

  // Fetch all data when user changes
  useEffect(() => {
    if (user) {
      fetchUserProfile()
      fetchDailyClaims()
      fetchRewards()
      fetchRedemptions()
      trackLogin()
    } else {
      setRewards([])
      setRedemptions([])
      setUserProfile(null)
      setDailyClaims([])
    }
  }, [user])

  return {
    rewards,
    redemptions,
    loading,
    error,
    fetchRewards,
    fetchRedemptions,
    addReward,
    claimDaily,
    updateReward,
    deleteReward,
    redeem,
    totals,
  }
}
