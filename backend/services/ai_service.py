import os
import json
import urllib.request
import urllib.error

# External AI configuration
AI_API_KEY = os.getenv("AI_API_KEY", "")
AI_MODEL = os.getenv("AI_MODEL", "gemini-1.5-flash")
AI_BASE_URL = os.getenv("AI_BASE_URL", "")

PROGRESSIVE_HINTS_DATABASE = {
    # Sliding window standard pattern hints
    "sliding_window": [
        {
            "step": 1,
            "type": "Conceptual Clue",
            "message": "Before thinking about the algorithm, ask yourself: Are you repeatedly examining a continuous portion or contiguous slice of the collection?"
        },
        {
            "step": 2,
            "type": "Directional Clue",
            "message": "Think about whether you can maintain a moving range [left, right] instead of recomputing the entire sub-range sum or frequency from scratch every time."
        },
        {
            "step": 3,
            "type": "Pattern Clue",
            "message": "This is a strong signal for the Sliding Window pattern. Notice that when the right pointer expands by 1 element, only one item enters your range, and when the left pointer shrinks, only one exits."
        },
        {
            "step": 4,
            "type": "Algorithmic Approach",
            "message": "Initialize `left = 0`, `current_state = 0`, and iterate `right` from 0 to len-1. Add `nums[right]` to current_state. While the constraint is violated (or window exceeds condition), remove `nums[left]` and advance `left += 1`. Update your optimal answer at valid states."
        },
        {
            "step": 5,
            "type": "Detailed Explanation",
            "message": "Here is the exact structure:\n```python\nleft = 0\ncurrent_val = 0\nmax_ans = 0\nfor right in range(len(nums)):\n    # 1. Expand window with right element\n    current_val += nums[right]\n    \n    # 2. Shrink window from left if invalid\n    while invalid_condition:\n        current_val -= nums[left]\n        left += 1\n        \n    # 3. Record answer\n    max_ans = max(max_ans, current_val)\nreturn max_ans\n```\nThis guarantees an optimal O(N) time complexity because both left and right pointers traverse the array at most once!"
        }
    ],
    # Two Pointers pattern hints
    "two_pointers": [
        {
            "step": 1,
            "type": "Conceptual Clue",
            "message": "Look at the order of the data. Is the collection sorted, or does comparing elements from opposing sides yield predictable trends?"
        },
        {
            "step": 2,
            "type": "Directional Clue",
            "message": "If you position one pointer at index 0 and another at index N - 1, how does incrementing the left pointer or decrementing the right pointer affect your sum or condition?"
        },
        {
            "step": 3,
            "type": "Pattern Clue",
            "message": "This is the classic Two Pointers (Converging) pattern. Since the search space is monotonic, you can eliminate an entire candidate set in O(1) time at each step."
        },
        {
            "step": 4,
            "type": "Algorithmic Approach",
            "message": "Set `left = 0, right = n - 1`. While `left < right`: if `nums[left] + nums[right] == target`, return indices; if the sum is too small, increase `left`; if the sum is too large, decrease `right`."
        },
        {
            "step": 5,
            "type": "Detailed Explanation",
            "message": "Converging two pointers provides an optimal O(N) time solution with O(1) auxiliary space, bypassing quadratic O(N^2) brute force nested loops."
        }
    ]
}

def generate_mentor_response(
    action_type: str,
    problem_title: str = "Maximum Subarray of Size K",
    pattern_name: str = "Sliding Window",
    current_code: str = "",
    user_message: str = "",
    hint_step: int = 1
) -> dict:
    """
    DSA Mentor AI Engine:
    Guides the student with progressive hints and pedagogical questions
    instead of spoon-feeding the code.
    """
    
    # 1. Explain Problem
    if action_type == "explain_problem":
        return {
            "message": (
                f"### Problem Breakdown: {problem_title}\n\n"
                f"Let's break down the objective without jargon:\n"
                f"- **Goal**: You need to evaluate contiguous sections of the input and find an optimal metric.\n"
                f"- **Key Constraint**: The elements must be **contiguous** (no skipping items).\n"
                f"- **Intuition Question**: What would a naive solution do? It would recalculate the metric from scratch for every possible starting position, taking O(N × K) or O(N²).\n"
                f"- **Your Challenge**: Can we compute each new window from the previous window in O(1) time?\n\n"
                f"*What property changes when you slide a view over the list by one element?*"
            ),
            "hint_step": 1,
            "suggested_questions": [
                "Help me find the pattern",
                "Give me a conceptual hint",
                "What is the time complexity target?"
            ],
            "is_mentor_style": True
        }

    # 2. Progressive Hints (Hint 1 to 5)
    elif action_type == "give_hint":
        hints = PROGRESSIVE_HINTS_DATABASE.get("sliding_window")
        step_idx = min(max(hint_step, 1), 5) - 1
        hint_obj = hints[step_idx]
        next_step = step_idx + 2 if step_idx < 4 else 5

        return {
            "message": (
                f"### 💡 Hint {hint_obj['step']} of 5: {hint_obj['type']}\n\n"
                f"{hint_obj['message']}\n\n"
                f"*(Take 2-3 minutes to reflect on this clue before requesting the next level)*"
            ),
            "hint_step": next_step,
            "suggested_questions": [
                f"Request Hint {next_step} ({'Directional' if next_step==2 else 'Pattern' if next_step==3 else 'Algorithmic' if next_step==4 else 'Code Structure'})" if next_step <= 5 else "I understand, let me write code!",
                "Help me find the pattern",
                "Review my code for mistakes"
            ],
            "is_mentor_style": True
        }

    # 3. Help Me Find the Pattern
    elif action_type == "find_pattern":
        return {
            "message": (
                f"### 🔍 Recognizing the Pattern\n\n"
                f"When analyzing a problem, look for these signature signals:\n"
                f"1. **Input Structure**: Are we working on linear sequential data (Array, String, Linked List)?\n"
                f"2. **Problem Keywords**: Notice terms like `contiguous`, `subarray`, `substring`, `size K`, `maximum sum`, `at most K distinct`.\n"
                f"3. **State Transition**: Adding the next item on the right and dropping the oldest item on the left takes **O(1)**.\n\n"
                f"👉 **Identified Pattern**: **{pattern_name}**.\n\n"
                f"Instead of resetting our calculation, we simply maintain a dynamic window that expands with `right` and contracts with `left`."
            ),
            "hint_step": 3,
            "suggested_questions": [
                "Show me the window expansion/shrink flow",
                "What edge cases should I handle?",
                "Give me an algorithmic hint"
            ],
            "is_mentor_style": True
        }

    # 4. Explain My Approach
    elif action_type == "explain_approach":
        code_length = len(current_code.strip()) if current_code else 0
        has_loop = "for " in current_code or "while " in current_code
        return {
            "message": (
                f"### 📐 Approach Analysis\n\n"
                f"Looking at your current implementation:\n"
                f"- **Structure**: You have established {'a loop iteration' if has_loop else 'an initial structure'}.\n"
                f"- **Core Mechanism**: Your approach appears to {'process elements linearly' if has_loop else 'be in drafting stage'}.\n"
                f"- **Key Check**: Ensure you aren't doing nested loops that recalculate inner elements unnecessarily. In the optimal {pattern_name} pattern, each element enters the window once and leaves at most once, yielding **O(N)** overall.\n\n"
                f"Are you tracking running accumulators (e.g., `window_sum`, `char_freq`) outside the loop?"
            ),
            "hint_step": 3,
            "suggested_questions": [
                "Find my mistake",
                "Explain the time complexity of this approach",
                "Give me a hint on window shrinking"
            ],
            "is_mentor_style": True
        }

    # 5. Find My Mistake
    elif action_type == "find_mistake":
        mistake_analysis = ""
        if not current_code or len(current_code.strip()) < 20:
            mistake_analysis = "You haven't written much code yet. Start by defining your function parameters, `left = 0`, and a loop for `right`."
        elif "left += 1" not in current_code and "left+=1" not in current_code:
            mistake_analysis = "⚠️ **Watch out**: I noticed you haven't incremented your `left` pointer inside the shrinking condition. If you don't advance `left`, the window size will grow unbounded or cause an infinite loop!"
        elif "return" not in current_code:
            mistake_analysis = "⚠️ **Missing Return**: Remember to return your calculated optimal result at the end of the function."
        else:
            mistake_analysis = "Check your window boundary edge conditions: What happens if `len(nums) < k` or if all numbers in the array are negative?"

        return {
            "message": (
                f"### 🧐 Mistake & Bug Diagnostic\n\n"
                f"{mistake_analysis}\n\n"
                f"**Common pitfalls in {pattern_name}:**\n"
                f"- Forgetting to subtract the leaving element `nums[left]` before doing `left += 1`\n"
                f"- Off-by-one errors with array indices (0-indexed vs length `k`)\n"
                f"- Initializing maximum answer to 0 when inputs can have negative values (use `-float('inf')` instead)."
            ),
            "hint_step": 4,
            "suggested_questions": [
                "Explain how to handle negative numbers",
                "Show the exact while loop condition",
                "Explain Complexity"
            ],
            "is_mentor_style": True
        }

    # 6. Explain Complexity
    elif action_type == "explain_complexity":
        return {
            "message": (
                f"### ⏱️ Time & Space Complexity Breakdown\n\n"
                f"#### Time Complexity: **O(N)**\n"
                f"Students often get confused by the nested `while` loop inside the `for` loop and mistakenly assume it is O(N²).\n"
                f"**Why is it O(N)?**\n"
                f"- The `right` pointer moves from 0 to N-1 (N steps).\n"
                f"- The `left` pointer moves from 0 to N-1 (at most N steps across the entire function).\n"
                f"- Since each pointer moves forward only and never resets backwards, the total pointer operations are bounded by 2N = **O(N)** (amortized).\n\n"
                f"#### Space Complexity: **O(1)** or **O(K)**\n"
                f"- If tracking only a scalar sum/count: **O(1)** auxiliary memory.\n"
                f"- If tracking unique characters or frequencies in a hash map: **O(min(N, Σ))** where Σ is the alphabet size."
            ),
            "hint_step": 5,
            "suggested_questions": [
                "Explain what amortized time means",
                "Give me a hint on my code",
                "Explain Problem"
            ],
            "is_mentor_style": True
        }

    # 7. Conversational Mentor Chat
    else:
        user_text = (user_message or "").lower()
        if "stuck" in user_text or "help" in user_text:
            msg = (
                "Before thinking about the algorithm, ask yourself: Are you repeatedly examining a continuous portion of the array?\n\n"
                "Think about whether you can maintain a moving range instead of recomputing the entire range."
            )
        elif "pattern" in user_text:
            msg = (
                f"The key pattern here is **{pattern_name}**.\n"
                f"Notice the core signals: 'contiguous', 'longest/shortest', 'fixed or dynamic range'. "
                f"Whenever you can expand by adding 1 element and contract by removing 1 element in O(1), use Sliding Window."
            )
        else:
            msg = (
                f"As your DSA mentor, I encourage you to think through the invariants.\n\n"
                f"In this problem, what defines a 'valid' window? Once you know that condition, you simply write a loop that expands until invalid, then contracts until valid again."
            )

        return {
            "message": msg,
            "hint_step": 2,
            "suggested_questions": [
                "Give me a conceptual hint",
                "Help me find the pattern",
                "Explain Complexity"
            ],
            "is_mentor_style": True
        }
