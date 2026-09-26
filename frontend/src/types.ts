export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type PatternStatus = 'Locked' | 'Not Started' | 'In Progress' | 'Completed' | 'Mastered';

export interface User {
  id: number;
  name: string;
  email: string;
  target_role: string;
  target_company: string;
  current_streak: number;
  recognition_score: number;
  tests_completed: number;
  tests_correct: number;
}

export interface ProblemSummary {
  id: number;
  pattern_id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  estimated_time: string;
  order_index: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
}

export interface Hint {
  id: number;
  hint_level: number;
  clue_type: string;
  content: string;
}

export interface TestCase {
  input: string;
  expected: string;
}

export interface ProblemDetail {
  id: number;
  pattern_id: number;
  pattern_name: string;
  topic_name: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  estimated_time: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starter_code: string;
  test_cases: TestCase[];
  solution_approach?: string;
  hints: Hint[];
  current_status: string;
  last_code?: string;
}

export interface PatternFlowStep {
  step: number;
  title: string;
  desc: string;
}

export interface Pattern {
  id: number;
  topic_id: number;
  topic_name?: string;
  name: string;
  slug: string;
  description: string;
  when_to_recognize: string[];
  common_signals: string[];
  pattern_flow: PatternFlowStep[];
  time_complexity: string;
  space_complexity: string;
  implementation_structure: string;
  common_mistakes?: string;
  status: PatternStatus;
  solved_count: number;
  total_problems: number;
  problems: ProblemSummary[];
}

export interface Topic {
  id: number;
  name: string;
  slug: string;
  description: string;
  order_index: number;
  icon: string;
  skill_level_pct: number;
  patterns: Pattern[];
  total_patterns: number;
  mastered_patterns: number;
}

export interface DashboardData {
  user: {
    name: string;
    target_role: string;
    target_company: string;
  };
  stats: {
    overall_progress_pct: number;
    problems_solved: number;
    patterns_mastered: number;
    current_streak_days: number;
    recognition_accuracy: string;
    recognition_score_pct: number;
  };
  continue_path: {
    current_topic: string;
    current_pattern: string;
    pattern_slug: string;
    solved_in_pattern: number;
    total_in_pattern: number;
    next_problem_slug: string;
    next_problem_title: string;
    next_problem_difficulty: string;
  };
  todays_goal: {
    title: string;
    items: { text: string; completed: boolean }[];
  };
  skill_map: {
    topic: string;
    percentage: number;
    color: string;
  }[];
  recommended_next: {
    pattern_name: string;
    pattern_slug: string;
    topic: string;
    reason: string;
    difficulty: string;
  };
}

export interface CompanyQuestion {
  id: number;
  company_id: number;
  title: string;
  difficulty: Difficulty;
  topic_name: string;
  pattern_name: string;
  source: string;
  frequency: string;
}

export interface Company {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  description: string;
  target_roles: string[];
  relevant_topics: { topic: string; coverage: number }[];
  difficulty_profile: string;
  focus_next: string[];
  questions: CompanyQuestion[];
}

export interface Opportunity {
  id: number;
  title: string;
  organization: string;
  category: string;
  deadline: string;
  eligibility: string;
  skills: string;
  official_link: string;
  is_demo: boolean;
  location: string;
  stipend_or_prize: string;
  is_bookmarked: boolean;
}

export interface PatternQuestion {
  id: number;
  title: string;
  problem_snippet: string;
  options: string[];
}

export interface PatternAnswerResult {
  is_correct: boolean;
  correct_pattern: string;
  explanation: string;
  why_it_works: string;
  user_score_pct: number;
  total_answered: number;
  total_correct: number;
}
