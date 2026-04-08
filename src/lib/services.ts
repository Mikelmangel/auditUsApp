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
  role: 'admin' | 'member';
  joined_at: string;
  profiles: Profile;
};

export type Poll = {
  id: string;
  group_id: string;
  question: string;
  rendered_question?: string;
  poll_type: 'pool' | 'vs' | 'boolean' | 'ranked';
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  groups?: { id: string; name: string };
};

export type Question = {
  id: string;
  text: string;
  poll_type: 'pool' | 'vs' | 'boolean' | 'ranked';
  category: string;
  min_members: number;
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

    // Auto-join the creator as admin
    const { error: joinError } = await supabase
      .from('group_members')
      .insert([{ group_id: data.id, profile_id: userId, role: 'admin' }]);
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

    // Check if already a member
    const { data: existing } = await supabase
      .from('group_members')
      .select('profile_id')
      .eq('group_id', group.id)
      .eq('profile_id', userId)
      .single();
    if (existing) throw new Error('Ya eres miembro de este grupo');

    const { error: joinError } = await supabase
      .from('group_members')
      .insert([{ group_id: group.id, profile_id: userId, role: 'member' }]);
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
      .select('profile_id, group_id, role, joined_at, profiles(id, username, avatar_url, points, current_streak)')
      .eq('group_id', groupId)
      .order('joined_at', { ascending: true });
    if (error) return [];
    return data as unknown as GroupMember[];
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
};

// ─────────────────────────────────────────────
// POLL SERVICE
// ─────────────────────────────────────────────

export const pollService = {
  async createPoll(groupId: string, question: string, userId: string, pollType: Poll['poll_type'] = 'pool') {
    const { data, error } = await supabase
      .from('polls')
      .insert([{
        group_id: groupId,
        question,
        rendered_question: question,
        poll_type: pollType,
        created_by: userId,
        is_active: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }])
      .select()
      .single();
    if (error) throw error;
    return data as Poll;
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
      .select('*, groups(id, name)')
      .eq('id', pollId)
      .single();
    if (error) return null;
    return data;
  },

  async hasVoted(pollId: string, userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('voter_id', userId)
      .single();
    return !!data;
  },

  async castVote(pollId: string, voterId: string, targetId: string) {
    const { error } = await supabase
      .from('votes')
      .insert([{ poll_id: pollId, voter_id: voterId, target_id: targetId }]);
    if (error) throw error;

    // Update streak and points
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_streak, last_voted_at, points')
      .eq('id', voterId)
      .single();

    if (profile) {
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

      await supabase
        .from('profiles')
        .update({
          current_streak: newStreak,
          last_voted_at: now.toISOString(),
          points: (profile.points || 0) + 10,
        })
        .eq('id', voterId);
    }
  },

  async getResults(pollId: string): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('votes')
      .select('target_id')
      .eq('poll_id', pollId);
    if (error) return {};

    return data.reduce((acc: Record<string, number>, curr: any) => {
      acc[curr.target_id] = (acc[curr.target_id] || 0) + 1;
      return acc;
    }, {});
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

  async addComment(pollId: string, authorId: string, content: string): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ poll_id: pollId, author_id: authorId, content }])
      .select('*, profiles(username, avatar_url)')
      .single();
    if (error) throw error;
    return data;
  },
};

// ─────────────────────────────────────────────
// QUESTION SERVICE
// ─────────────────────────────────────────────

export const questionService = {
  async getRandomQuestion(groupId: string, memberCount: number): Promise<Question | null> {
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
