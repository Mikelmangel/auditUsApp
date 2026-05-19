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
  app_language?: string;
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
  language?: string;
  created_at: string;
};

export type GroupMember = {
  profile_id: string;
  group_id: string;
  role: 'creator' | 'admin' | 'member';
  status: 'active' | 'banned';
  joined_at: string;
  group_points: number;
  profiles: Profile;
};

export type QuestionCategory = 
  | 'humor' | 'habilidades' | 'futuro' | 'atrevidas' 
  | 'hipoteticas' | 'vinculos' | 'eventos' | 'ia_custom' | 'general';

export type QuestionMode = 'vs' | 'poll' | 'mc' | 'scale' | 'free' | 'ranking' | 'ranked';

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

  async updateProfile(userId: string, updates: Partial<Pick<Profile, 'username' | 'full_name' | 'bio' | 'avatar_url' | 'app_language'>>) {
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
  async createGroup(name: string, userId: string, description?: string, emoji = '🔮', language = 'es') {
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
        language,
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
      .select('profile_id, group_id, role, status, joined_at, group_points, profiles(id, username, avatar_url, points, current_streak)')
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

async function updateGroupPoints(userId: string, groupId: string, amount: number) {
  // Atomic: group points updated via RPC (race-safe)
  await supabase.rpc('add_group_points', { p_user_id: userId, p_group_id: groupId, p_amount: amount });
}

async function updateStreakAndPoints(voterId: string) {
  // Atomic: streak + points updated in a single SQL transaction (race-safe)
  await supabase.rpc('update_streak_and_points', { p_user_id: voterId, p_points: 10 });
}

// ─────────────────────────────────────────────
// POLL SERVICE
// ─────────────────────────────────────────────

export const pollService = {
  async createPoll(groupId: string, question: string, userId: string, pollType: QuestionMode | 'prediction' = 'poll', questionId?: string) {
    // Check per-group limit (5 active polls per group)
    const { count } = await supabase
      .from('polls')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', groupId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString());
      
    if (count && count >= 5) {
      throw new Error("Active poll limit reached (5 max).");
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
      // Atomic: add 50 points per winner via RPC (race-safe)
      await Promise.all(
        winningVotes.map(v => supabase.rpc('add_points', { p_user_id: v.voter_id, p_amount: 50 }))
      );
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
    const { data: poll } = await supabase.from('polls').select('group_id').eq('id', pollId).single();
    await updateStreakAndPoints(voterId);
    if (poll?.group_id) await updateGroupPoints(voterId, poll.group_id, 10);
  },

  // Ranking mode: orderedMemberIds[0] = #1 position
  async castRankingVote(pollId: string, voterId: string, orderedMemberIds: string[]) {
    const { error } = await supabase
      .from('votes')
      .insert([{ poll_id: pollId, voter_id: voterId, target_id: JSON.stringify(orderedMemberIds) }]);
    if (error) throw error;
    const { data: poll } = await supabase.from('polls').select('group_id').eq('id', pollId).single();
    await updateStreakAndPoints(voterId);
    if (poll?.group_id) await updateGroupPoints(voterId, poll.group_id, 10);
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

  async closeExpiredPolls(): Promise<number> {
    const { data, error } = await supabase
      .from('polls')
      .update({ is_active: false })
      .eq('is_active', true)
      .not('expires_at', 'is', null)
      .lt('expires_at', new Date().toISOString())
      .select('id');
    if (error) throw error;
    return data?.length ?? 0;
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

  async hasTodaySummary(groupId: string): Promise<boolean> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { data } = await supabase
      .from('group_summaries')
      .select('id')
      .eq('group_id', groupId)
      .eq('period', 'daily')
      .gte('created_at', todayStart.toISOString())
      .limit(1);
    return (data?.length ?? 0) > 0;
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

    // Active members
    const { data: memberRows } = await supabase
      .from('group_members')
      .select('profile_id, profiles(username)')
      .eq('group_id', groupId)
      .eq('status', 'active');

    const nameMap: Record<string, string> = {};
    (memberRows ?? []).forEach((m: any) => {
      if (m.profiles?.username) nameMap[m.profile_id] = m.profiles.username;
    });
    const allIds = Object.keys(nameMap);
    const memberNames = Object.values(nameMap);

    // Today's polls with votes (voter_id + target_id) and comments
    const { data: polls } = await supabase
      .from('polls')
      .select('id, question, rendered_question, poll_type, votes(voter_id, target_id), comments(content, profiles(username))')
      .eq('group_id', groupId)
      .gte('created_at', todayStart.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    // Today's nudges via poll_ids
    const pollIds = (polls ?? []).map((p: any) => p.id);
    let nudgeRows: any[] = [];
    if (pollIds.length > 0) {
      const { data: nd } = await supabase
        .from('nudges')
        .select('sender_id, receiver_id, sender:profiles!nudges_sender_id_fkey(username), receiver:profiles!nudges_receiver_id_fkey(username)')
        .in('poll_id', pollIds)
        .gte('created_at', todayStart.toISOString());
      nudgeRows = nd ?? [];
    }

    // Build structured poll stats
    const pollStats = (polls ?? []).map((p: any) => {
      const votes: { voter_id: string; target_id: string }[] = p.votes ?? [];

      // Who voted
      const voterIds = Array.from(new Set(votes.map(v => v.voter_id)));
      const voterNames = voterIds.map(id => nameMap[id] ?? id);
      const nonVoterNames = allIds.filter(id => !voterIds.includes(id)).map(id => nameMap[id]);

      // Vote tally by target
      const tally: Record<string, number> = {};
      votes.forEach(v => {
        const name = nameMap[v.target_id] ?? v.target_id;
        tally[name] = (tally[name] ?? 0) + 1;
      });
      const results = Object.entries(tally)
        .map(([name, count]) => ({ name, votes: count }))
        .sort((a, b) => b.votes - a.votes);

      const comments = (p.comments ?? []).map((c: any) => ({
        content: c.content,
        author: c.profiles?.username ?? '?',
      }));

      return {
        question: p.rendered_question || p.question,
        type: p.poll_type,
        voters: voterNames,
        nonVoters: nonVoterNames,
        results,
        comments,
        participationPct: allIds.length > 0 ? Math.round(voterIds.length / allIds.length * 100) : 0,
      };
    });

    // Nudge list
    const nudges = nudgeRows.map(n => ({
      sender: (n.sender as any)?.username ?? nameMap[n.sender_id] ?? '?',
      receiver: (n.receiver as any)?.username ?? nameMap[n.receiver_id] ?? '?',
    }));

    return { members: memberNames, polls: pollStats, nudges };
  },
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

    // Get group's language
    const { data: group } = await supabase
      .from('groups')
      .select('language, name')
      .eq('id', groupId)
      .single();
    const groupLanguage = group?.language || 'es';

    // AI Generation Case
    if (categoryFilter === 'ia_custom') {
      try {
        const { data: members } = await supabase
          .from('group_members')
          .select('profiles(username)')
          .eq('group_id', groupId);
        
        const memberNames = members?.map((m: any) => m.profiles?.username).filter(Boolean) || [];
        const aiRes = await fetch('/api/ai/question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: 'ia_custom',
            groupName: group?.name || 'AuditUs',
            memberNames,
            language: groupLanguage,
          }),
        });
        if (!aiRes.ok) throw new Error('AI generation failed');
        const aiQ = await aiRes.json();
        
        return {
          id: 'ai-' + Math.random().toString(36).substring(7),
          text: aiQ.text,
          mode: aiQ.mode,
          category: 'ia_custom',
          language: groupLanguage,
          is_active: true,
          min_members: 2,
          is_anonymous: false
        } as Question;
      } catch (err) {
        console.error("AI Question Generation Failed:", err);
        // Fallback to general category if AI fails
        categoryFilter = 'humor';
      }
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
      .eq('language', groupLanguage)
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
    
    // Fallback logic for regional languages
    if ((error || !data || data.length === 0) && groupLanguage.includes('-')) {
      const baseLang = groupLanguage.split('-')[0];
      const fallbackQuery = supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .eq('language', baseLang)
        .lte('min_members', memberCount);

      if (categoryFilter) fallbackQuery.eq('category', categoryFilter);
      if (modeFilter) fallbackQuery.eq('mode', modeFilter);
      if (excludeIds.length > 0) fallbackQuery.not('id', 'in', `(${excludeIds.join(',')})`);

      const { data: fallbackData } = await fallbackQuery;
      if (fallbackData && fallbackData.length > 0) {
        const randomIndex = Math.floor(Math.random() * fallbackData.length);
        return fallbackData[randomIndex] as Question;
      }
    }

    if (error || !data || data.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex] as Question;
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
// GROUP UPGRADE SERVICE
// ─────────────────────────────────────────────

export const groupUpgradeService = {
  async getUpgrade(groupId: string): Promise<{ ia_custom_unlocked: boolean } | null> {
    const { data } = await supabase
      .from('group_upgrades')
      .select('ia_custom_unlocked')
      .eq('group_id', groupId)
      .single();
    return data;
  },

  async unlockIaCustom(groupId: string): Promise<void> {
    const { error } = await supabase
      .from('group_upgrades')
      .upsert([{
        group_id: groupId,
        ia_custom_unlocked: true,
        unlocked_at: new Date().toISOString(),
      }]);
    if (error) throw error;
  },
};

// ─────────────────────────────────────────────
// SURVIVAL SERVICE (Battle Royale v2)
// ─────────────────────────────────────────────

export type SurvivalGame = {
  id: string;
  group_id: string;
  status: 'active' | 'finished';
  phase: 'voting' | 'final_duel' | 'finished';
  current_round: number;
  total_rounds: number;
  winner_id?: string;
  round_deadline?: string;
  round_processed?: boolean;
  created_at: string;
  participants: SurvivalParticipant[];
  survival_participants?: SurvivalParticipant[];
};

export type SurvivalParticipant = {
  game_id: string;
  profile_id: string;
  is_eliminated: boolean;
  eliminated_at?: string;
  eliminated_round?: number;
  final_position?: number;
  points_earned: number;
  is_immune: boolean;
  profiles?: Profile;
};

export type SurvivalVote = {
  id: string;
  game_id: string;
  round: number;
  voter_id: string;
  target_id: string;
  created_at: string;
};

export const survivalService = {
  // ── Fetch active game with participants + profiles ──
  async getActiveGame(groupId: string): Promise<SurvivalGame | null> {
    const { data } = await supabase
      .from('survival_games')
      .select('*, survival_participants(*, profiles(id, username, avatar_url, points))')
      .eq('group_id', groupId)
      .eq('status', 'active')
      .single();

    if (data) {
      data.participants = data.survival_participants || [];
    }
    return data as SurvivalGame | null;
  },

  // ── Fetch a finished game by ID ──
  async getGame(gameId: string): Promise<SurvivalGame | null> {
    const { data } = await supabase
      .from('survival_games')
      .select('*, survival_participants(*, profiles(id, username, avatar_url, points))')
      .eq('id', gameId)
      .single();

    if (data) {
      data.participants = data.survival_participants || [];
    }
    return data as SurvivalGame | null;
  },

  // ── Start a new Battle Royale ──
  async startSurvivalGame(groupId: string, memberIds: string[]): Promise<SurvivalGame> {
    const existing = await this.getActiveGame(groupId);
    if (existing) throw new Error('Ya hay un Battle Royale activo en este grupo.');
    if (memberIds.length < 4) throw new Error('Se necesitan al menos 4 miembros para iniciar un Battle Royale.');

    const totalRounds = memberIds.length - 1;
    const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h first round

    const { data: game, error: gameErr } = await supabase
      .from('survival_games')
      .insert([{
        group_id: groupId,
        status: 'active',
        phase: 'voting',
        current_round: 1,
        total_rounds: totalRounds,
        round_deadline: deadline.toISOString(),
        round_processed: false,
      }])
      .select()
      .single();
    if (gameErr) throw gameErr;

    // 2. Insert Participants
    const participants = memberIds.map(id => ({
      game_id: game.id,
      profile_id: id,
      is_eliminated: false,
      is_immune: false,
      points_earned: 0,
    }));
    const { error: partErr } = await supabase
      .from('survival_participants')
      .insert(participants);
    if (partErr) throw partErr;

    return { ...game, participants: participants as SurvivalParticipant[] };
  },

  // ── Cast a survival vote ──
  async castSurvivalVote(gameId: string, round: number, voterId: string, targetId: string) {
    if (voterId === targetId) throw new Error('No puedes votarte a ti mismo.');

    const { error } = await supabase
      .from('survival_votes')
      .insert([{ game_id: gameId, round, voter_id: voterId, target_id: targetId }]);

    if (error) {
      if (String(error.code) === '23505') throw new Error('Ya has votado en esta ronda.');
      throw error;
    }
  },

  // ── Check if user has voted this round ──
  async hasVotedThisRound(gameId: string, round: number, userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('survival_votes')
      .select('id')
      .eq('game_id', gameId)
      .eq('round', round)
      .eq('voter_id', userId)
      .maybeSingle();
    return !!data;
  },

  // ── Get vote results for a round ──
  async getRoundVotes(gameId: string, round: number): Promise<Record<string, number>> {
    const { data } = await supabase
      .from('survival_votes')
      .select('target_id')
      .eq('game_id', gameId)
      .eq('round', round);

    if (!data) return {};
    return data.reduce((acc: Record<string, number>, v) => {
      acc[v.target_id] = (acc[v.target_id] || 0) + 1;
      return acc;
    }, {});
  },

  // ── Get total voters this round ──
  async getRoundVoterCount(gameId: string, round: number): Promise<number> {
    const { count } = await supabase
      .from('survival_votes')
      .select('*', { count: 'exact', head: true })
      .eq('game_id', gameId)
      .eq('round', round);
    return count || 0;
  },

  // ── Get alive participants ──
  async getAliveParticipants(gameId: string): Promise<SurvivalParticipant[]> {
    const { data } = await supabase
      .from('survival_participants')
      .select('*, profiles(id, username, avatar_url, points)')
      .eq('game_id', gameId)
      .eq('is_eliminated', false);
    return (data || []) as SurvivalParticipant[];
  },

  // ── Set deadline for current round ──
  async startRound(gameId: string, deadlineHours = 24) {
    const deadline = new Date(Date.now() + deadlineHours * 60 * 60 * 1000);
    await supabase
      .from('survival_games')
      .update({ round_deadline: deadline.toISOString(), round_processed: false })
      .eq('id', gameId);
  },

  // ── Check if current round deadline has passed ──
  async hasRoundExpired(gameId: string): Promise<boolean> {
    const { data } = await supabase
      .from('survival_games')
      .select('round_deadline, round_processed')
      .eq('id', gameId)
      .single();
    if (!data?.round_deadline) return false;
    if (data.round_processed) return false;
    return new Date() > new Date(data.round_deadline);
  },

  // ── Process round elimination (called by cron or manual trigger) ──
  async processRoundElimination(gameId: string): Promise<{ eliminatedId: string | null; isFinished: boolean }> {
    // Idempotency guard — mark processed before doing anything
    const { data: guard } = await supabase
      .from('survival_games')
      .update({ round_processed: true })
      .eq('id', gameId)
      .eq('round_processed', false)
      .select('id')
      .single();
    if (!guard) return { eliminatedId: null, isFinished: false }; // already processed

    const game = await this.getGame(gameId);
    if (!game || game.status !== 'active') return { eliminatedId: null, isFinished: false };

    const alive = game.participants.filter(p => !p.is_eliminated);
    const votes = await this.getRoundVotes(gameId, game.current_round);

    // Find who got most votes (excluding immune players)
    let maxVotes = 0;
    let candidates: string[] = [];

    Object.entries(votes).forEach(([targetId, count]) => {
      const participant = alive.find(p => p.profile_id === targetId);
      if (!participant || participant.is_immune) return;

      if (count > maxVotes) {
        maxVotes = count;
        candidates = [targetId];
      } else if (count === maxVotes) {
        candidates.push(targetId);
      }
    });

    // No votes cast → skip round (no elimination)
    if (candidates.length === 0) {
      await this.advanceRound(gameId);
      return { eliminatedId: null, isFinished: false };
    }

    // Tie-breaker: random among tied
    const eliminatedId = candidates[Math.floor(Math.random() * candidates.length)];
    const position = alive.length; // e.g., if 5 alive, eliminated gets position 5

    // Eliminate
    await supabase
      .from('survival_participants')
      .update({
        is_eliminated: true,
        eliminated_at: new Date().toISOString(),
        eliminated_round: game.current_round,
        final_position: position,
      })
      .eq('game_id', gameId)
      .eq('profile_id', eliminatedId);

    // Give survival points to those who survived this round
    for (const p of alive) {
      if (p.profile_id !== eliminatedId) {
        await supabase
          .from('survival_participants')
          .update({ points_earned: (p.points_earned || 0) + 25 })
          .eq('game_id', gameId)
          .eq('profile_id', p.profile_id);

        // Add to global profile points
        const { data: profile } = await supabase.from('profiles').select('points').eq('id', p.profile_id).single();
        if (profile) {
          await supabase.from('profiles').update({ points: (profile.points || 0) + 25 }).eq('id', p.profile_id);
        }
      }
    }

    const remaining = alive.filter(p => p.profile_id !== eliminatedId);

    // Check if we should move to final duel or finish
    if (remaining.length === 2) {
      // Move to final duel
      await supabase
        .from('survival_games')
        .update({ phase: 'final_duel', current_round: game.current_round + 1 })
        .eq('id', gameId);
      return { eliminatedId, isFinished: false };
    }

    if (remaining.length <= 1) {
      // Game over — crown the last one
      const winnerId = remaining[0]?.profile_id;
      if (winnerId) await this.crownWinner(gameId, winnerId);
      return { eliminatedId, isFinished: true };
    }

    // Advance to next round (sets new 24h deadline)
    await this.advanceRound(gameId);
    return { eliminatedId, isFinished: false };
  },

  // ── Process final duel ──
  async processFinalDuel(gameId: string): Promise<string | null> {
    const game = await this.getGame(gameId);
    if (!game || game.phase !== 'final_duel') return null;

    const alive = game.participants.filter(p => !p.is_eliminated);
    if (alive.length !== 2) return null;

    const votes = await this.getRoundVotes(gameId, game.current_round);
    const [a, b] = alive;
    const votesA = votes[a.profile_id] || 0;
    const votesB = votes[b.profile_id] || 0;

    // The one with FEWER votes wins (votes = votes to eliminate)
    // If tied, random
    let winnerId: string;
    let loserId: string;
    if (votesA < votesB) {
      winnerId = a.profile_id;
      loserId = b.profile_id;
    } else if (votesB < votesA) {
      winnerId = b.profile_id;
      loserId = a.profile_id;
    } else {
      // Tie — random
      if (Math.random() < 0.5) {
        winnerId = a.profile_id;
        loserId = b.profile_id;
      } else {
        winnerId = b.profile_id;
        loserId = a.profile_id;
      }
    }

    // Mark loser as eliminated
    await supabase
      .from('survival_participants')
      .update({
        is_eliminated: true,
        eliminated_at: new Date().toISOString(),
        eliminated_round: game.current_round,
        final_position: 2,
        points_earned: 200,
      })
      .eq('game_id', gameId)
      .eq('profile_id', loserId);

    // Give runner-up 200 global points
    const { data: loserProfile } = await supabase.from('profiles').select('points').eq('id', loserId).single();
    if (loserProfile) {
      await supabase.from('profiles').update({ points: (loserProfile.points || 0) + 200 }).eq('id', loserId);
    }

    await this.crownWinner(gameId, winnerId);
    return winnerId;
  },

  // ── Advance to next round ──
  async advanceRound(gameId: string) {
    await supabase
      .from('survival_participants')
      .update({ is_immune: false })
      .eq('game_id', gameId);

    const { data: game } = await supabase
      .from('survival_games')
      .select('current_round')
      .eq('id', gameId)
      .single();

    if (game) {
      const nextDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await supabase
        .from('survival_games')
        .update({
          current_round: game.current_round + 1,
          round_deadline: nextDeadline.toISOString(),
          round_processed: false,
        })
        .eq('id', gameId);
    }
  },

  // ── Crown winner ──
  async crownWinner(gameId: string, winnerId: string) {
    // Update game
    await supabase
      .from('survival_games')
      .update({ status: 'finished', phase: 'finished', winner_id: winnerId })
      .eq('id', gameId);

    // Update winner participant
    await supabase
      .from('survival_participants')
      .update({ final_position: 1, points_earned: 500 })
      .eq('game_id', gameId)
      .eq('profile_id', winnerId);

    // Add 500 global points to winner
    const { data: profile } = await supabase.from('profiles').select('points').eq('id', winnerId).single();
    if (profile) {
      await supabase.from('profiles').update({ points: (profile.points || 0) + 500 }).eq('id', winnerId);
    }
  },

  // ── Eliminate participant (legacy compat) ──
  async eliminateParticipant(gameId: string, profileId: string) {
    const { error } = await supabase
      .from('survival_participants')
      .update({ is_eliminated: true, eliminated_at: new Date().toISOString() })
      .eq('game_id', gameId)
      .eq('profile_id', profileId);
    if (error) throw error;
  },

  // ── Finish game (legacy compat) ──
  async finishGame(gameId: string) {
    const { error } = await supabase
      .from('survival_games')
      .update({ status: 'finished', phase: 'finished' })
      .eq('id', gameId);
    if (error) throw error;
  },

  // ── Game history for a group ──
  async getGameHistory(groupId: string): Promise<SurvivalGame[]> {
    const { data } = await supabase
      .from('survival_games')
      .select('*, survival_participants(*, profiles(id, username, avatar_url))')
      .eq('group_id', groupId)
      .eq('status', 'finished')
      .order('created_at', { ascending: false })
      .limit(10);

    return (data || []).map((g: any) => ({ ...g, participants: g.survival_participants || [] })) as SurvivalGame[];
  },
};
