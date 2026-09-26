import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Suresh G")
    email = Column(String(100), unique=True, index=True)
    target_role = Column(String(100), default="AI Engineer")
    target_company = Column(String(100), default="Google")
    current_streak = Column(Integer, default=7)
    recognition_score = Column(Float, default=80.0) # percentage or points
    tests_completed = Column(Integer, default=10)
    tests_correct = Column(Integer, default=8)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    submissions = relationship("Submission", back_populates="user", cascade="all, delete-orphan")
    progress_records = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    mock_interviews = relationship("MockInterview", back_populates="user", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    slug = Column(String(100), unique=True, index=True)
    description = Column(Text)
    order_index = Column(Integer, default=0)
    icon = Column(String(50), default="Layers")
    skill_level_pct = Column(Integer, default=0)

    patterns = relationship("Pattern", back_populates="topic", cascade="all, delete-orphan")
    company_questions = relationship("CompanyQuestion", back_populates="topic")

class Pattern(Base):
    __tablename__ = "patterns"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    name = Column(String(100), index=True)
    slug = Column(String(100), index=True)
    description = Column(Text)
    when_to_recognize = Column(Text) # JSON or markdown list
    common_signals = Column(Text) # JSON or markdown list of keywords
    pattern_flow = Column(Text) # JSON or markdown steps e.g. Expand -> Check -> Maintain
    time_complexity = Column(String(100), default="O(N)")
    space_complexity = Column(String(100), default="O(1)")
    implementation_structure = Column(Text)
    common_mistakes = Column(Text)
    order_index = Column(Integer, default=0)
    status = Column(String(50), default="In Progress") # Locked, Not Started, In Progress, Completed, Mastered

    topic = relationship("Topic", back_populates="patterns")
    problems = relationship("Problem", back_populates="pattern", cascade="all, delete-orphan")

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    pattern_id = Column(Integer, ForeignKey("patterns.id"), nullable=False)
    title = Column(String(200), index=True)
    slug = Column(String(200), index=True)
    difficulty = Column(String(20), default="Easy") # Easy, Medium, Hard
    estimated_time = Column(String(50), default="20 mins")
    description = Column(Text)
    examples = Column(Text) # JSON string of examples: input, output, explanation
    constraints = Column(Text) # JSON string or markdown
    starter_code = Column(Text)
    test_cases = Column(Text) # JSON string: [{"input": "...", "expected": "...", "hidden": false}]
    solution_approach = Column(Text)
    order_index = Column(Integer, default=0)

    pattern = relationship("Pattern", back_populates="problems")
    hints = relationship("Hint", back_populates="problem", cascade="all, delete-orphan")
    progress_records = relationship("Progress", back_populates="problem")
    submissions = relationship("Submission", back_populates="problem")

class Hint(Base):
    __tablename__ = "hints"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    hint_level = Column(Integer, default=1) # 1: Conceptual clue, 2: Directional clue, 3: Pattern-level, 4: Algorithmic, 5: Detailed
    clue_type = Column(String(100), default="Conceptual")
    content = Column(Text)

    problem = relationship("Problem", back_populates="hints")

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    status = Column(String(50), default="not_started") # not_started, in_progress, completed, mastered
    last_code = Column(Text, nullable=True)
    hints_used = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="progress_records")
    problem = relationship("Problem", back_populates="progress_records")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    code = Column(Text)
    language = Column(String(50), default="python")
    status = Column(String(50), default="Accepted") # Accepted, Wrong Answer, Time Limit Exceeded
    runtime_ms = Column(Integer, default=45)
    memory_mb = Column(Float, default=16.4)
    passed_tests = Column(Integer, default=3)
    total_tests = Column(Integer, default=3)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="submissions")
    problem = relationship("Problem", back_populates="submissions")

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    slug = Column(String(100), unique=True, index=True)
    logo = Column(String(200), nullable=True)
    description = Column(Text)
    target_roles = Column(Text) # JSON array of roles e.g. ["Software Engineer", "Backend Developer", "Data Engineer"]
    interview_focus = Column(Text) # Relevant topics JSON
    difficulty_profile = Column(String(50), default="High")

    questions = relationship("CompanyQuestion", back_populates="company", cascade="all, delete-orphan")

class CompanyQuestion(Base):
    __tablename__ = "company_questions"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True)
    title = Column(String(200))
    difficulty = Column(String(50), default="Medium")
    topic_name = Column(String(100))
    pattern_name = Column(String(100))
    source = Column(String(100), default="Community Verified Experience (Glassdoor/LeetCode)")
    frequency = Column(String(50), default="Very High")
    problem_id = Column(Integer, nullable=True)

    company = relationship("Company", back_populates="questions")
    topic = relationship("Topic", back_populates="company_questions")

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True)
    organization = Column(String(100))
    category = Column(String(100), default="Hiring Challenge") # Hiring Challenges, Hackathons, Coding Contests, Internships, Technical Challenges
    deadline = Column(String(100))
    eligibility = Column(String(200))
    skills = Column(String(200)) # comma-separated
    official_link = Column(String(500))
    is_demo = Column(Boolean, default=True) # Clearly labeled Demo Opportunity
    location = Column(String(100), default="Remote / Hybrid")
    stipend_or_prize = Column(String(100), default="Pre-placement Interview + Prizes")

class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="bookmarks")

class MockInterview(Base):
    __tablename__ = "mock_interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_company = Column(String(100))
    topic = Column(String(100))
    difficulty = Column(String(50), default="Medium")
    time_limit_minutes = Column(Integer, default=45)
    time_taken_seconds = Column(Integer, default=0)
    problem_title = Column(String(200))
    problem_description = Column(Text)
    submitted_code = Column(Text)
    correctness_score = Column(Integer, default=85) # out of 100
    pattern_recognition_score = Column(Integer, default=90)
    time_complexity_score = Column(Integer, default=80)
    space_complexity_score = Column(Integer, default=85)
    explanation_quality_score = Column(Integer, default=88)
    feedback_markdown = Column(Text)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="mock_interviews")

class PatternRecognitionQuestion(Base):
    __tablename__ = "pattern_recognition_questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    problem_snippet = Column(Text)
    options = Column(Text) # JSON array of options: ["Two Pointers", "Sliding Window", "Hashing", "Binary Search"]
    correct_pattern = Column(String(100))
    explanation = Column(Text)
    key_signals = Column(Text) # comma-separated cues
