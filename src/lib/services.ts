import { supabase } from './supabase';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type Profile = {
  id: string;
  username: string;
  avatar_url?: string;
  full_name?: string;
  bio?: string;
  points: number;
  current_streak: number;
  last_voted_at?: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  avatar_emoji?: string;
  invite_code: string;
  created_by: string;
  member_count?: number;
  is_public?: boolean;
  created_at: string;
};

export type GroupMember = {
  profile_id: string;
  group_id: string;
  role: 'creator' | 'admin' | 'member';
  status: 'active' | 'banned';
  joined_at: string;
  profiles: Profile;
};

export type QuestionCategory = 
  | 'humor' | 'habilidades' | 'futuro' | 'atrevidas' 
  | 'hipoteticas' | 'vinculos' | 'eventos' | 'ia_custom' | 'general';

export type QuestionMode = 'vs' | 'poll' | 'mc' | 'scale' | 'free' | 'ranking' | 'pool' | 'boolean' | 'ranked';

export type Poll = {
  id: string;
  group_id: string;
  question: string;
  rendered_question?: string;
  poll_type: QuestionMode | 'prediction' | 'battle_royale';
  question_mode?: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  groups?: { id: string; name: string };
  questions?: Question;
  resolution_status?: 'open' | 'resolved';
  resolved_target_id?: string;
  phase?: 'answering' | 'guessing';
  vs_member_a?: string;
  vs_member_b?: string;
};


export type Question = {
  id: string;
  text: string;
  mode: QuestionMode;
  poll_type?: string; // Legacy
  category: QuestionCategory;
  options?: string[];
  is_anonymous: boolean;
  min_members: number;
  max_members?: number;
  tags?: string[];
};

export type Nudge = {
  id: string;
  poll_id: string;
  sender_id: string;
  receiver_id: string;
  is_read: boolean;
  created_at: string;
  polls?: { question: string, rendered_question?: string, groups?: { name: string } };
  sender?: { username: string };
};

export type Comment = {
  id: string;
  poll_id: string;
  author_id: string;
  content: string;
  created_at: string;
  profiles?: { username: string; avatar_url?: string };
};

export type VoteResult = {
  target_id: string;
  count: number;
  percentage: number;
  profile?: Profile;
};

// ─────────────────────────────────────────────
// PROFILE SERVICE
// ─────────────────────────────────────────────

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Pick<Profile, 'username' | 'full_name' | 'bio' | 'avatar_url'>>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getBadges(userId: string): Promise<Badge[]> {
    const { data, error } = await supabase
      .from('profile_badges')
      .select('badge_id, earned_at, badges(*)')
      .eq('profile_id', userId);
    if (error) return [];
    return data.map((d: any) => d.badges).filter(Boolean);
  },

  async getLeaderboard(limit = 20): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, points, current_streak')
      .order('points', { ascending: false })
      .limit(limit);
    if (error) return [];
    return data;
  },
};

// ─────────────────────────────────────────────
// GROUP SERVICE
// ─────────────────────────────────────────────

export const groupService = {
  async createGroup(name: string, userId: string, description?: string, emoji = '🔮') {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase
      .from('groups')
      .insert([{
        name,
        description,
        avatar_emoji: emoji,
        created_by: userId,
        invite_code: inviteCode,
        member_count: 0,
      }])
      .select()
      .single();
    if (error) throw error;

    // Auto-join the creator as creator
    const { error: joinError } = await supabase
      .from('group_members')
      .insert([{ group_id: data.id, profile_id: userId, role: 'creator', status: 'active' }]);
    if (joinError) throw joinError;

    return data as Group;
  },

  async joinGroup(code: string, userId: string) {
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id, name')
      .eq('invite_code', code.trim().toUpperCase())
      .single();
    if (groupError || !group) throw new Error('Código de grupo no válido');

    // Check if already a member or banned
    const { data: existing } = await supabase
      .from('group_members')
      .select('profile_id, status')
      .eq('group_id', group.id)
      .eq('profile_id', userId)
      .maybeSingle();

    if (existing) {
      if (existing.status === 'banned') throw new Error('Has sido expulsado de este grupo y no puedes volver a entrar');
      throw new Error('Ya eres miembro de este grupo');
    }

    const { error: joinError } = await supabase
      .from('group_members')
      .insert([{ group_id: group.id, profile_id: userId, role: 'member', status: 'active' }]);
    if (joinError) throw joinError;

    return group as Pick<Group, 'id' | 'name'>;
  },

  async getMyGroups(userId: string): Promise<Group[]> {
    const { data, error } = await supabase
      .from('group_members')
      .select('groups(*)')
      .eq('profile_id', userId);
    if (error) return [];
    return data.map((d: any) => d.groups).filter(Boolean);
  },

  async getGroup(groupId: string): Promise<Group | null> {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single();
    if (error) return null;
    return data;
  },

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    const { data, error } = await supabase
      .from('group_members')
      .select('profile_id, group_id, role, status, joined_at, profiles(id, username, avatar_url, points, current_streak)')
      .eq('group_id', groupId)
      .eq('status', 'active')
      .order('joined_at', { ascending: true });
    if (error) return [];
    return data as unknown as GroupMember[];
  },

  async kickMember(groupId: string, userId: string) {
    const { error } = await supabase
      .from('group_members')
      .update({ status: 'banned' })
      .eq('group_id', groupId)
      .eq('profile_id', userId);
    if (error) throw error;
  },

  async leaveGroup(groupId: string, userId: string) {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('profile_id', userId);
    if (error) throw error;
  },

  async getGroupPolls(groupId: string): Promise<Poll[]> {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) return [];
    return data;
  },

  async getAllGroups(): Promise<Group[]> {
    const { data, error } = await supabase
      .from('groups')
      .select('*');
    if (error) return [];
    return data;
  },
};

// ─────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────

async function updateStreakAndPoints(voterId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_streak, last_voted_at, points')
    .eq('id', voterId)
    .single();

  if (!profile) return;
  const now = new Date();
  const lastVote = profile.last_voted_at ? new Date(profile.last_voted_at) : null;
  let newStreak = profile.current_streak || 0;

  if (!lastVote) {
    newStreak = 1;
  } else {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last = new Date(lastVote.getFullYear(), lastVote.getMonth(), lastVote.getDate());
    const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) newStreak += 1;
    else if (diffDays > 1) newStreak = 1;
  }

  await supabase.from('profiles').update({
    current_streak: newStreak,
    last_voted_at: now.toISOString(),
    points: (profile.points || 0) + 10,
  }).eq('id', voterId);
}

// ─────────────────────────────────────────────
// POLL SERVICE
// ─────────────────────────────────────────────

export const pollService = {
  async createPoll(groupId: string, question: string, userId: string, pollType: QuestionMode | 'prediction' = 'poll', questionId?: string) {
    // Check per-user limit (5 active polls across ALL groups)
    const { count } = await supabase
      .from('polls')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', userId)
      .eq('is_active', true);
      
    if (count && count >= 5) {
      throw new Error("Límite de 5 encuestas activas alcanzado.");
    }

    // Get group members for placeholder substitution
    const members = await groupService.getGroupMembers(groupId);
    const group = await groupService.getGroup(groupId);
    
    // Pick random members for placeholders
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    const memberA = shuffled[0]?.profiles?.username || 'Alguien';
    const memberB = shuffled[1]?.profiles?.username || 'Otro';
    const memberAId = shuffled[0]?.profile_id;
    const memberBId = shuffled[1]?.profile_id;

    const rendered = questionService.renderQuestion(question, {
      groupName: group?.name,
      memberA: memberA,
      memberB: memberB,
      memberCount: members.length
    });

    const { data, error } = await supabase
      .from('polls')
      .insert([{
        group_id: groupId,
        question,
        rendered_question: rendered,
        poll_type: pollType,
        question_mode: pollType,
        question_id: questionId,
        created_by: userId,
        vs_member_a: memberAId,
        vs_member_b: memberBId,
        is_active: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        resolution_status: pollType === 'prediction' ? 'open' : null,
        phase: 'answering'
      }])
      .select()
      .maybeSingle();
    if (error) throw error;
    return data as Poll;
  },


  async getTodaysPollCount(groupId: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const { count, error } = await supabase
      .from('polls')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', groupId)
      .gte('created_at', `${today}T00:00:00`);
    if (error) return 0;
    return count || 0;
  },

  async getActivePoll(groupId: string): Promise<Poll | null> {
    const { data, error } = await supabase
      .from('polls')
      .select('*, groups(id, name)')
      .eq('group_id', groupId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (error) return null;
    return data;
  },

  async getPoll(pollId: string): Promise<Poll | null> {
    const { data, error } = await supabase
      .from('polls')
      .select('*, groups(id, name), questions(*)')
      .eq('id', pollId)
      .maybeSingle();
    if (error) return null;
    return data;
  },


  async resolvePrediction(pollId: string, resolvedTargetId: string, authorId: string) {
    const { error } = await supabase
      .from('polls')
      .update({ resolution_status: 'resolved', resolved_target_id: resolvedTargetId, is_active: false })
      .eq('id', pollId)
      .eq('poll_type', 'prediction');
    if (error) throw error;
    
    // Reward users who voted for resolvedTargetId
    const { data: winningVotes } = await supabase
      .from('votes')
      .select('voter_id')
      .eq('poll_id', pollId)
      .eq('target_id', resolvedTargetId);
      
    if (winningVotes && winningVotes.length > 0) {
      const winnerIds = winningVotes.map(v => v.voter_id);
      
      // Need manual query or loop for updates due to Supabase JS limits with in/update points
      for (const wid of winnerIds) {
        const { data: profile } = await supabase.from('profiles').select('points').eq('id', wid).single();
        if (profile) {
          await supabase.from('profiles').update({ points: profile.points + 50 }).eq('id', wid);
        }
      }
    }
  },

  async hasVoted(pollId: string, userId: string) {
    const { data } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('voter_id', userId)
      .maybeSingle();
    return !!data;
  },

  async castVote(pollId: string, voterId: string, targetId: string) {
    const { error } = await supabase
      .from('votes')
      .insert([{ poll_id: pollId, voter_id: voterId, target_id: targetId }]);
    if (error) throw error;
    await updateStreakAndPoints(voterId);
  },

  // Ranking mode: orderedMemberIds[0] = #1 position
  async castRankingVote(pollId: string, voterId: string, orderedMemberIds: string[]) {
    const { error } = await supabase
      .from('votes')
      .insert([{ poll_id: pollId, voter_id: voterId, target_id: JSON.stringify(orderedMemberIds) }]);
    if (error) throw error;
    await updateStreakAndPoints(voterId);
  },

  // Compute consensus ranking from all ranking votes
  async getRankingResults(pollId: string): Promise<{ memberId: string; avgRank: number; voteCount: number }[]> {
    const { data } = await supabase.from('votes').select('target_id').eq('poll_id', pollId);
    if (!data || data.length === 0) return [];
    const sums: Record<string, number> = {};
    const counts: Record<string, number> = {};
    for (const vote of data) {
      try {
        const order: string[] = JSON.parse(vote.target_id);
        order.forEach((id, idx) => {
          sums[id] = (sums[id] || 0) + (idx + 1);
          counts[id] = (counts[id] || 0) + 1;
        });
      } catch { /* skip non-JSON votes */ }
    }
    return Object.keys(sums)
      .map(id => ({ memberId: id, avgRank: sums[id] / counts[id], voteCount: counts[id] }))
      .sort((a, b) => a.avgRank - b.avgRank);
  },

  // Free-text mode: transition poll to guessing phase
  async transitionToGuessing(pollId: string) {
    const { error } = await supabase
      .from('polls')
      .update({ phase: 'guessing' })
      .eq('id', pollId);
    if (error) throw error;
  },

  // Free-text mode: fetch answers anonymously (shuffled, no voter identity)
  async getFreeAnswers(pollId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('votes')
      .select('target_id')
      .eq('poll_id', pollId);
    if (error || !data) return [];
    // Shuffle so submission order doesn't hint at identity
    return data.map(v => v.target_id).sort(() => Math.random() - 0.5);
  },

  async getVoters(pollId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('votes')
      .select('voter_id')
      .eq('poll_id', pollId);
    if (error) return [];
    return data.map((v: any) => v.voter_id);
  },

  async getResults(pollId: string) {
    const { data } = await supabase
      .from('votes')
      .select('target_id')
      .eq('poll_id', pollId);
    
    if (!data) return {};
    return data.reduce((acc: any, vote) => {
      acc[vote.target_id] = (acc[vote.target_id] || 0) + 1;
      return acc;
    }, {});
  },

  async closePoll(pollId: string) {
    const { error } = await supabase
      .from('polls')
      .update({ is_active: false })
      .eq('id', pollId);
    if (error) throw error;
  },

  async closeActivePolls(groupId: string) {
    const { error } = await supabase
      .from('polls')
      .update({ is_active: false })
      .eq('group_id', groupId)
      .eq('is_active', true);
    if (error) throw error;
  },
};

// ─────────────────────────────────────────────
// COMMENT SERVICE
// ─────────────────────────────────────────────

export const commentService = {
  async getComments(pollId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(username, avatar_url)')
      .eq('poll_id', pollId)
      .order('created_at', { ascending: true });
    if (error) return [];
    return data;
  },

  async addComment(poll_id: string, author_id: string, content: string): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ poll_id, author_id, content }])
      .select('*, profiles(username, avatar_url)')
      .single();
    if (error) throw error;
    return data;
  },
};

// ─────────────────────────────────────────────
// SUMMARY SERVICE
// ─────────────────────────────────────────────

export const summaryService = {
  async getSummaries(groupId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('group_summaries')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  async createSummary(groupId: string, period: 'daily' | 'weekly' | 'monthly' | 'annual', content: string, metadata: any) {
    const { data, error } = await supabase
      .from('group_summaries')
      .insert([{ group_id: groupId, period, content, metadata }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getSummaryStats(groupId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { data: polls } = await supabase
      .from('polls')
      .select('*, votes(target_id), comments(content, profiles(username))')
      .eq('group_id', groupId)
      .gte('created_at', todayStart.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    // Fetch members to map UUID to username
    const { data: members } = await supabase
      .from('group_members')
      .select('profile_id, profiles(username)')
      .eq('group_id', groupId);

    const nameMap: Record<string, string> = {};
    if (members) {
      members.forEach((m: any) => {
        if (m.profiles?.username) {
          nameMap[m.profile_id] = m.profiles.username;
        }
      });
    }

    // Replace target_id with usernames in votes
    if (polls) {
      polls.forEach(poll => {
        if (poll.votes) {
          poll.votes = poll.votes.map((v: any) => ({
            target_username: nameMap[v.target_id] || v.target_id
          }));
        }
      });
    }

    return polls;
  }
};

// ─────────────────────────────────────────────
// QUESTION SERVICE
// ─────────────────────────────────────────────

export const questionService = {
  async getRandomQuestion(groupId: string, memberCount: number, categoryFilter?: string, modeFilter?: string): Promise<Question | null> {
    // Fallback: ranking requires 4 members, fallback to poll
    if (modeFilter === 'ranking' && memberCount < 4) {
      modeFilter = 'poll';
    }

    // Get already used questions for this group
    const { data: usedIds } = await supabase
      .from('group_poll_history')
      .select('question_id')
      .eq('group_id', groupId);

    const excludeIds = usedIds?.map((r: any) => r.question_id) || [];

    let query = supabase
      .from('questions')
      .select('*')
      .eq('is_active', true)
      .lte('min_members', memberCount);

    if (categoryFilter) {
      query = query.eq('category', categoryFilter);
    }
    if (modeFilter) {
      query = query.eq('mode', modeFilter);
    }

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) return null;

    // Pick random
    const random = data[Math.floor(Math.random() * data.length)];
    return random;
  },

  // Render a question template with real group/member data
  renderQuestion(template: string, context: {
    groupName?: string;
    memberA?: string;
    memberB?: string;
    memberCount?: number;
  }): string {
    return template
      .replace(/\{group_name\}/g, context.groupName || 'el grupo')
      .replace(/\{member_A\}/g, context.memberA || 'Alguien')
      .replace(/\{member_B\}/g, context.memberB || 'Otro')
      .replace(/\{member_count\}/g, String(context.memberCount || 0));
  },
};

// ─────────────────────────────────────────────
// NUDGE SERVICE
// ─────────────────────────────────────────────

export const nudgeService = {
  async createNudge(pollId: string, senderId: string, receiverId: string) {
    const { error } = await supabase
      .from('nudges')
      .insert([{ poll_id: pollId, sender_id: senderId, receiver_id: receiverId }]);
    
    // We throw error if unique constraint fails to show "Ya le has zumbado"
    if (error) {
      if (String(error.code) === '23505' || error.message?.includes('duplicate key')) {
        throw new Error('Ya le has enviado un zumbido a esta persona para esta encuesta.');
      }
      throw error;
    }
  },

  async getUnreadNudges(userId: string): Promise<Nudge[]> {
    const { data, error } = await supabase
      .from('nudges')
      .select('*, polls(question, rendered_question, groups(name)), sender:profiles!nudges_sender_id_fkey(username)')
      .eq('receiver_id', userId)
      .eq('is_read', false);
    if (error) return [];
    return data as any as Nudge[];
  },

  async markAsRead(nudgeIds: string[]) {
    if (!nudgeIds.length) return;
    const { error } = await supabase
      .from('nudges')
      .update({ is_read: true })
      .in('id', nudgeIds);
    if (error) throw error;
  }
};

// ─────────────────────────────────────────────
// SURVIVAL SERVICE
// ─────────────────────────────────────────────

export const survivalService = {
  async getActiveGame(groupId: string) {
    const { data } = await supabase
      .from('survival_games')
      .select('*, survival_participants(*)')
      .eq('group_id', groupId)
      .eq('status', 'active')
      .single();
    
    if (data) {
      // Map it so the UI code doesn't break
      data.participants = data.survival_participants;
    }
    return data;
  },

  async startSurvivalGame(groupId: string, memberIds: string[]) {
    // 1. Create Game
    const { data: game, error: gameErr } = await supabase
      .from('survival_games')
      .insert([{ group_id: groupId, status: 'active' }])
      .select()
      .single();
    if (gameErr) throw gameErr;

    // 2. Insert Participants
    const participants = memberIds.map(id => ({
      game_id: game.id,
      profile_id: id,
      is_eliminated: false,
    }));
    const { error: partErr } = await supabase
      .from('survival_participants')
      .insert(participants);
    if (partErr) throw partErr;

    return game;
  },

  async eliminateParticipant(gameId: string, profileId: string) {
    const { error } = await supabase
      .from('survival_participants')
      .update({ is_eliminated: true, eliminated_at: new Date().toISOString() })
      .eq('game_id', gameId)
      .eq('profile_id', profileId);
    if (error) throw error;
  },

  async finishGame(gameId: string) {
    const { error } = await supabase
      .from('survival_games')
      .update({ status: 'finished' })
      .eq('id', gameId);
    if (error) throw error;
  }
};
