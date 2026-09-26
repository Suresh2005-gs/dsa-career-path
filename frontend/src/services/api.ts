import {
  DashboardData,
  Topic,
  Pattern,
  ProblemDetail,
  Company,
  Opportunity,
  PatternQuestion,
  PatternAnswerResult
} from '../types';

const API_BASE = '/api';

export const api = {
  // Auth
  async getCurrentUser() {
    const res = await fetch(`${API_BASE}/auth/me`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async loginDemo() {
    const res = await fetch(`${API_BASE}/auth/demo-login`, { method: 'POST' });
    if (!res.ok) throw new Error('Demo login failed');
    return res.json();
  },

  // Dashboard & Progress
  async getDashboard(): Promise<DashboardData> {
    try {
      const res = await fetch(`${API_BASE}/progress/dashboard`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Using cached dashboard fallback');
    }
    return {
      user: {
        name: 'Suresh G',
        target_role: 'AI Engineer',
        target_company: 'Google'
      },
      stats: {
        overall_progress_pct: 38,
        problems_solved: 4,
        patterns_mastered: 1,
        current_streak_days: 7,
        recognition_accuracy: '8 / 10',
        recognition_score_pct: 80.0
      },
      continue_path: {
        current_topic: 'Arrays',
        current_pattern: 'Sliding Window',
        pattern_slug: 'sliding-window',
        solved_in_pattern: 4,
        total_in_pattern: 9,
        next_problem_slug: 'minimum-size-subarray-sum',
        next_problem_title: 'Minimum Size Subarray Sum',
        next_problem_difficulty: 'Medium'
      },
      todays_goal: {
        title: "Today's Goal",
        items: [
          { text: '1 Easy Problem (Subarrays of Average >= Threshold)', completed: true },
          { text: '1 Medium Problem (Minimum Size Subarray Sum)', completed: false },
          { text: 'Pattern Recognition Challenge (2 Scenarios)', completed: false }
        ]
      },
      skill_map: [
        { topic: 'Arrays', percentage: 75, color: 'emerald' },
        { topic: 'Strings', percentage: 55, color: 'blue' },
        { topic: 'Hashing', percentage: 68, color: 'indigo' },
        { topic: 'Binary Search', percentage: 42, color: 'amber' },
        { topic: 'Trees', percentage: 25, color: 'purple' },
        { topic: 'Graphs', percentage: 15, color: 'rose' }
      ],
      recommended_next: {
        pattern_name: 'Two Pointers (Converging)',
        pattern_slug: 'converging-two-pointers',
        topic: 'Two Pointers',
        reason: 'Reinforces monotonic array boundary reductions after mastering sliding windows.',
        difficulty: 'Easy to Medium'
      }
    };
  },

  async getAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/progress/analytics`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Using analytics fallback');
    }
    return {
      problems_solved_over_time: [
        { date: 'Mon', solved: 1 },
        { date: 'Tue', solved: 2 },
        { date: 'Wed', solved: 1 },
        { date: 'Thu', solved: 3 },
        { date: 'Fri', solved: 2 },
        { date: 'Sat', solved: 4 },
        { date: 'Sun', solved: 2 }
      ],
      patterns_mastered_data: [
        { topic: 'Arrays', mastered: 1, in_progress: 1, unstarted: 5 },
        { topic: 'Two Pointers', mastered: 1, in_progress: 0, unstarted: 3 },
        { topic: 'Hashing', mastered: 1, in_progress: 1, unstarted: 2 },
        { topic: 'Binary Search', mastered: 0, in_progress: 1, unstarted: 3 },
        { topic: 'Trees', mastered: 0, in_progress: 0, unstarted: 4 },
        { topic: 'Graphs', mastered: 0, in_progress: 0, unstarted: 5 }
      ],
      recognition_accuracy_history: [
        { session: 'Set 1', score: 60 },
        { session: 'Set 2', score: 70 },
        { session: 'Set 3', score: 75 },
        { session: 'Set 4', score: 80 },
        { session: 'Set 5', score: 85 }
      ],
      hint_usage_distribution: [
        { level: 'Hint 1 (Conceptual)', count: 14 },
        { level: 'Hint 2 (Directional)', count: 9 },
        { level: 'Hint 3 (Pattern Clue)', count: 6 },
        { level: 'Hint 4 (Algorithmic)', count: 3 },
        { level: 'Hint 5 (Code Structure)', count: 1 }
      ]
    };
  },

  // Topics & Roadmap
  async getTopics(): Promise<Topic[]> {
    const res = await fetch(`${API_BASE}/topics`);
    if (!res.ok) throw new Error('Failed to fetch topics');
    return res.json();
  },

  // Pattern Details
  async getPattern(slug: string): Promise<Pattern> {
    const res = await fetch(`${API_BASE}/patterns/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch pattern');
    return res.json();
  },

  // Problem Workspace
  async getProblem(slugOrId: string | number): Promise<ProblemDetail> {
    const res = await fetch(`${API_BASE}/problems/${slugOrId}`);
    if (!res.ok) throw new Error('Failed to fetch problem');
    return res.json();
  },

  async runCode(problemId: number, code: string) {
    const res = await fetch(`${API_BASE}/submissions/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem_id: problemId, code, language: 'python' })
    });
    if (!res.ok) throw new Error('Failed to run code');
    return res.json();
  },

  async submitCode(problemId: number, code: string) {
    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem_id: problemId, code, language: 'python' })
    });
    if (!res.ok) throw new Error('Failed to submit code');
    return res.json();
  },

  // AI DSA Mentor
  async askAiMentor(payload: {
    problem_id?: number;
    action_type: string;
    current_code?: string;
    user_message?: string;
    hint_step?: number;
  }) {
    try {
      const res = await fetch(`${API_BASE}/ai/mentor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('AI fallback triggered');
    }
    return {
      message: 'AI Assistant is temporarily unavailable. You can continue solving using the built-in hints.',
      hint_step: (payload.hint_step || 1) + 1,
      suggested_questions: ['Give me a hint', 'Explain Problem', 'Find my mistake'],
      is_mentor_style: true
    };
  },

  // Pattern Recognition Test
  async getPatternQuestions(): Promise<PatternQuestion[]> {
    const res = await fetch(`${API_BASE}/pattern-test/questions`);
    if (!res.ok) throw new Error('Failed to fetch pattern questions');
    return res.json();
  },

  async submitPatternAnswer(questionId: number, selectedPattern: string): Promise<PatternAnswerResult> {
    const res = await fetch(`${API_BASE}/pattern-test/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: questionId, selected_pattern: selectedPattern })
    });
    if (!res.ok) throw new Error('Failed to submit pattern answer');
    return res.json();
  },

  // Company Prep
  async getCompanies(): Promise<Company[]> {
    const res = await fetch(`${API_BASE}/companies`);
    if (!res.ok) throw new Error('Failed to fetch companies');
    return res.json();
  },

  async getCompanyDetail(slug: string, role = 'Software Engineer'): Promise<Company> {
    const res = await fetch(`${API_BASE}/companies/${slug}?role=${encodeURIComponent(role)}`);
    if (!res.ok) throw new Error('Failed to fetch company detail');
    return res.json();
  },

  // Opportunities
  async getOpportunities(category?: string, search?: string, onlyBookmarked = false): Promise<Opportunity[]> {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (onlyBookmarked) params.append('only_bookmarked', 'true');

    const res = await fetch(`${API_BASE}/opportunities?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch opportunities');
    return res.json();
  },

  async toggleBookmark(oppId: number) {
    const res = await fetch(`${API_BASE}/opportunities/${oppId}/bookmark`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to toggle bookmark');
    return res.json();
  },

  // Mock Interview
  async startMockInterview(payload: { target_company: string; topic: string; difficulty: string; time_limit_minutes: number }) {
    const res = await fetch(`${API_BASE}/mock-interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to start mock interview');
    return res.json();
  },

  async submitMockInterview(payload: { interview_id: number; code: string; time_taken_seconds: number }) {
    const res = await fetch(`${API_BASE}/mock-interview/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to submit mock interview');
    return res.json();
  }
};
