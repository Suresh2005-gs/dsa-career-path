from typing import List, Optional, Any
from pydantic import BaseModel
import datetime

# User Schemas
class UserBase(BaseModel):
    name: str
    email: str
    target_role: Optional[str] = "AI Engineer"
    target_company: Optional[str] = "Google"

class UserCreate(UserBase):
    password: Optional[str] = "password"

class UserOut(UserBase):
    id: int
    current_streak: int
    recognition_score: float
    tests_completed: int
    tests_correct: int
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

# Hint Schemas
class HintOut(BaseModel):
    id: int
    hint_level: int
    clue_type: str
    content: str

    class Config:
        from_attributes = True

# Problem Schemas
class ProblemSimple(BaseModel):
    id: int
    pattern_id: int
    title: str
    slug: str
    difficulty: str
    estimated_time: str
    order_index: int
    status: Optional[str] = "not_started"

    class Config:
        from_attributes = True

class ProblemDetail(BaseModel):
    id: int
    pattern_id: int
    pattern_name: Optional[str] = None
    topic_name: Optional[str] = None
    title: str
    slug: str
    difficulty: str
    estimated_time: str
    description: str
    examples: Any
    constraints: Any
    starter_code: str
    test_cases: Any
    solution_approach: Optional[str] = None
    hints: List[HintOut] = []
    current_status: Optional[str] = "not_started"
    last_code: Optional[str] = None

    class Config:
        from_attributes = True

# Pattern Schemas
class PatternSummary(BaseModel):
    id: int
    topic_id: int
    name: str
    slug: str
    description: str
    status: str
    problem_count: int = 9
    solved_count: int = 0
    easy_count: int = 3
    medium_count: int = 3
    hard_count: int = 3

    class Config:
        from_attributes = True

class PatternDetail(BaseModel):
    id: int
    topic_id: int
    topic_name: Optional[str] = None
    name: str
    slug: str
    description: str
    when_to_recognize: Any
    common_signals: Any
    pattern_flow: Any
    time_complexity: str
    space_complexity: str
    implementation_structure: str
    common_mistakes: Optional[str] = None
    status: str
    solved_count: int = 0
    total_problems: int = 9
    problems: List[ProblemSimple] = []

    class Config:
        from_attributes = True

# Topic Schemas
class TopicSummary(BaseModel):
    id: int
    name: str
    slug: str
    description: str
    order_index: int
    icon: str
    skill_level_pct: int
    patterns: List[PatternSummary] = []
    total_patterns: int = 0
    mastered_patterns: int = 0

    class Config:
        from_attributes = True

# Submission Schemas
class SubmissionCreate(BaseModel):
    problem_id: int
    code: str
    language: str = "python"

class TestCaseResult(BaseModel):
    test_num: int
    input_str: str
    expected_output: str
    actual_output: str
    passed: bool
    runtime_ms: int

class SubmissionResult(BaseModel):
    id: int
    problem_id: int
    status: str # Accepted, Wrong Answer, etc.
    runtime_ms: int
    memory_mb: float
    passed_tests: int
    total_tests: int
    test_results: List[TestCaseResult] = []
    time_complexity: str = "O(N)"
    space_complexity: str = "O(1)"
    learning_feedback: str

# AI Assistant Schemas
class AIChatRequest(BaseModel):
    problem_id: Optional[int] = None
    action_type: str # "explain_problem" | "give_hint" | "find_pattern" | "explain_approach" | "find_mistake" | "explain_complexity" | "chat"
    current_code: Optional[str] = None
    user_message: Optional[str] = None
    hint_step: Optional[int] = 1

class AIChatResponse(BaseModel):
    message: str
    hint_step: Optional[int] = None
    suggested_questions: List[str] = []
    is_mentor_style: bool = True

# Pattern Recognition Test
class PatternQuestionOut(BaseModel):
    id: int
    title: str
    problem_snippet: str
    options: List[str]
    correct_pattern: Optional[str] = None
    explanation: Optional[str] = None
    key_signals: Optional[str] = None

class PatternAnswerSubmit(BaseModel):
    question_id: int
    selected_pattern: str

class PatternAnswerResult(BaseModel):
    is_correct: bool
    correct_pattern: str
    explanation: str
    why_it_works: str
    user_score_pct: float
    total_answered: int
    total_correct: int

# Company Schemas
class CompanyQuestionOut(BaseModel):
    id: int
    company_id: int
    title: str
    difficulty: str
    topic_name: str
    pattern_name: str
    source: str
    frequency: str
    problem_id: Optional[int] = None

class CompanyDetail(BaseModel):
    id: int
    name: str
    slug: str
    logo: Optional[str] = None
    description: str
    target_roles: List[str]
    relevant_topics: List[dict] # [{"topic": "Arrays", "coverage": 100}, ...]
    difficulty_profile: str
    focus_next: List[str]
    questions: List[CompanyQuestionOut]

# Opportunity Schemas
class OpportunityOut(BaseModel):
    id: int
    title: str
    organization: str
    category: str
    deadline: str
    eligibility: str
    skills: str
    official_link: str
    is_demo: bool
    location: str
    stipend_or_prize: str
    is_bookmarked: bool = False

# Mock Interview Schemas
class MockInterviewStart(BaseModel):
    target_company: str
    topic: str
    difficulty: str = "Medium"
    time_limit_minutes: int = 45

class MockInterviewSubmit(BaseModel):
    interview_id: int
    code: str
    time_taken_seconds: int

class MockInterviewEvaluation(BaseModel):
    id: int
    target_company: str
    topic: str
    difficulty: str
    correctness_score: int
    pattern_recognition_score: int
    time_complexity_score: int
    space_complexity_score: int
    explanation_quality_score: int
    learning_feedback: str
    strengths: List[str]
    areas_for_improvement: List[str]
