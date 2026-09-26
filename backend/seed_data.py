import json
from .database import SessionLocal, engine, Base
from .models import (
    User, Topic, Pattern, Problem, Hint, Progress, Submission,
    Company, CompanyQuestion, Opportunity, PatternRecognitionQuestion
)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # If already seeded with users, skip
    if db.query(User).first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding DSA Clear Path database...")

    # 1. Create Default User (Suresh G)
    user = User(
        name="Suresh G",
        email="suresh@dsaclearpath.dev",
        target_role="AI Engineer",
        target_company="Google",
        current_streak=7,
        recognition_score=80.0,
        tests_completed=10,
        tests_correct=8
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 2. Topics
    topics_data = [
        {"name": "Arrays", "slug": "arrays", "desc": "Contiguous memory structures, index arithmetic, subarray windows, and prefix transformations.", "icon": "Layers", "skill": 75},
        {"name": "Strings", "slug": "strings", "desc": "Character sequences, palindromes, anagram patterns, and sliding windows on text.", "icon": "Type", "skill": 55},
        {"name": "Hashing", "slug": "hashing", "desc": "Constant-time lookups, frequency counters, duplicate tracking, and pair complement sets.", "icon": "Hash", "skill": 68},
        {"name": "Two Pointers", "slug": "two-pointers", "desc": "Opposite-end convergence, fast-and-slow runner pointers, and partitioned scans.", "icon": "GitFork", "skill": 60},
        {"name": "Sliding Window", "slug": "sliding-window", "desc": "Dynamic and fixed-size contiguous ranges that expand and shrink in linear time.", "icon": "Maximize2", "skill": 44},
        {"name": "Binary Search", "slug": "binary-search", "desc": "Logarithmic search spaces, monotonic boundary predicates, and rotated array pivots.", "icon": "Search", "skill": 42},
        {"name": "Linked List", "slug": "linked-list", "desc": "Pointer manipulation, reversal in k-groups, cycle detection, and dummy head mechanics.", "icon": "Link2", "skill": 35},
        {"name": "Stack", "slug": "stack", "desc": "LIFO structures, monotonic stacks, balanced parentheses, and span evaluations.", "icon": "Layers", "skill": 30},
        {"name": "Queue", "slug": "queue", "desc": "FIFO structures, sliding window maximum deques, and level-order traversal buffers.", "icon": "ListOrdered", "skill": 28},
        {"name": "Trees", "slug": "trees", "desc": "Hierarchical structures, recursion invariants, BST properties, and lowest common ancestors.", "icon": "Network", "skill": 25},
        {"name": "Graphs", "slug": "graphs", "desc": "Topological sort, shortest paths, BFS exploration, and connected components.", "icon": "Share2", "skill": 15},
        {"name": "Greedy", "slug": "greedy", "desc": "Locally optimal decision making, interval scheduling, and jump game heuristics.", "icon": "Zap", "skill": 20},
        {"name": "Backtracking", "slug": "backtracking", "desc": "State-space tree exploration, constraint satisfaction, and combinatorial pruning.", "icon": "RotateCcw", "skill": 18},
        {"name": "Dynamic Programming", "slug": "dynamic-programming", "desc": "Overlapping subproblems, state transitions, memoization, and tabular optimization.", "icon": "Cpu", "skill": 10}
    ]

    topics_map = {}
    for idx, t in enumerate(topics_data):
        topic_obj = Topic(
            name=t["name"],
            slug=t["slug"],
            description=t["desc"],
            order_index=idx + 1,
            icon=t["icon"],
            skill_level_pct=t["skill"]
        )
        db.add(topic_obj)
        db.commit()
        db.refresh(topic_obj)
        topics_map[t["name"]] = topic_obj

    # 3. Patterns under Topics
    # Focusing especially on Arrays, Strings, Sliding Window, Two Pointers, Hashing, Binary Search, Trees, Graphs
    sw_pattern = Pattern(
        topic_id=topics_map["Arrays"].id,
        name="Sliding Window",
        slug="sliding-window",
        description="Sliding Window is useful when a problem involves a continuous subarray or substring and requires maintaining information about a moving range.",
        when_to_recognize=json.dumps([
            "Continuous subarray or substring problem",
            "Longest or shortest range meeting a constraint",
            "Dynamic range expansion and contraction",
            "Need to maintain window state in O(1) time per item",
            "Avoids repeated O(K) recomputation of overlapping segments"
        ]),
        common_signals=json.dumps([
            "subarray", "substring", "longest", "shortest", "maximum sum", "minimum length", "contiguous", "at most k"
        ]),
        pattern_flow=json.dumps([
            {"step": 1, "title": "Expand Window", "desc": "Advance the right pointer and incorporate nums[right] into current window state."},
            {"step": 2, "title": "Check Condition", "desc": "Evaluate if the current window satisfies or violates the specified problem constraint."},
            {"step": 3, "title": "Maintain Window", "desc": "If valid, record or update the global optimal metric (e.g. max_length, min_sum)."},
            {"step": 4, "title": "Shrink When Necessary", "desc": "Advance the left pointer and remove nums[left] while the condition remains violated."},
            {"step": 5, "title": "Update Answer", "desc": "Yield the recorded optimal answer after traversing the entire sequence in linear time."}
        ]),
        time_complexity="O(N) Amortized",
        space_complexity="O(1) to O(K)",
        implementation_structure="""def sliding_window(nums, k):
    left = 0
    current_state = 0
    best_result = 0
    for right in range(len(nums)):
        current_state += nums[right]
        while invalid_condition(current_state):
            current_state -= nums[left]
            left += 1
        best_result = max(best_result, current_state)
    return best_result""",
        common_mistakes="""- Forgetting to deduct nums[left] before incrementing left pointer
- Off-by-one errors in window size calculations (right - left + 1)
- Initializing optimal values to 0 when input may have negative elements
- Using nested recalculations that revert time complexity back to O(N^2)""",
        order_index=1,
        status="In Progress"
    )
    db.add(sw_pattern)

    tp_pattern = Pattern(
        topic_id=topics_map["Two Pointers"].id,
        name="Converging Two Pointers",
        slug="converging-two-pointers",
        description="Two Pointers is ideal for ordered collections where you can eliminate search space from both ends simultaneously.",
        when_to_recognize=json.dumps([
            "Sorted array or monotonic collection",
            "Target sum pairs or triplets",
            "Palindrome verification or in-place reversing",
            "Subarrays requiring two directional bounds"
        ]),
        common_signals=json.dumps([
            "sorted array", "pair with target sum", "triplet", "palindrome", "reverse in-place", "two ends"
        ]),
        pattern_flow=json.dumps([
            {"step": 1, "title": "Initialize Pointers", "desc": "Place left at index 0 and right at index n - 1."},
            {"step": 2, "title": "Evaluate Metric", "desc": "Compute metric = nums[left] + nums[right]."},
            {"step": 3, "title": "Adjust Pointers", "desc": "If metric == target, return; if metric < target, left += 1; if metric > target, right -= 1."},
            {"step": 4, "title": "Terminate", "desc": "Stop when left >= right."}
        ]),
        time_complexity="O(N)",
        space_complexity="O(1)",
        implementation_structure="""def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        curr = nums[left] + nums[right]
        if curr == target:
            return [left, right]
        elif curr < target:
            left += 1
        else:
            right -= 1
    return []""",
        common_mistakes="Using two pointers on unsorted inputs without sorting first.",
        order_index=1,
        status="Mastered"
    )
    db.add(tp_pattern)

    hash_pattern = Pattern(
        topic_id=topics_map["Hashing"].id,
        name="Complement Lookup",
        slug="complement-lookup",
        description="Store seen elements in a hash map to verify if the required counterpart exists in O(1) time.",
        when_to_recognize=json.dumps([
            "Unsorted collections looking for exact complements (e.g. target - x)",
            "Frequency distribution and anagram matching",
            "First unique element or duplicate detection"
        ]),
        common_signals=json.dumps(["two sum", "complement", "frequency", "unique", "duplicate", "O(1) lookup"]),
        pattern_flow=json.dumps([
            {"step": 1, "title": "Initialize Map", "desc": "Create an empty hash map seen = {}"},
            {"step": 2, "title": "Scan Elements", "desc": "For each element x at index i, compute complement = target - x."},
            {"step": 3, "title": "Check Seen", "desc": "If complement in seen, return [seen[complement], i]. Otherwise, seen[x] = i."}
        ]),
        time_complexity="O(N)",
        space_complexity="O(N)",
        implementation_structure="""def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        comp = target - num
        if comp in seen:
            return [seen[comp], i]
        seen[num] = i
    return []""",
        common_mistakes="Attempting to use the same index twice when target = 2 * x.",
        order_index=1,
        status="Completed"
    )
    db.add(hash_pattern)

    bs_pattern = Pattern(
        topic_id=topics_map["Binary Search"].id,
        name="Binary Search on Monotonic Space",
        slug="binary-search-monotonic",
        description="Halve the search space repeatedly when a monotonic property (True/False boundary) exists.",
        when_to_recognize=json.dumps([
            "Sorted arrays",
            "Minimize the maximum / Maximize the minimum optimization questions",
            "Search in rotated arrays with single inflection point"
        ]),
        common_signals=json.dumps(["sorted", "log(n)", "minimum maximum", "rotated array", "first occurrence"]),
        pattern_flow=json.dumps([
            {"step": 1, "title": "Set Bounds", "desc": "low = 0, high = len(arr) - 1"},
            {"step": 2, "title": "Compute Mid", "desc": "mid = low + (high - low) // 2"},
            {"step": 3, "title": "Discard Half", "desc": "Branch low = mid + 1 or high = mid - 1 based on comparison."}
        ]),
        time_complexity="O(log N)",
        space_complexity="O(1)",
        implementation_structure="""def binary_search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1""",
        common_mistakes="Integer overflow when calculating (low + high) in some languages or while loop condition off-by-one.",
        order_index=1,
        status="Not Started"
    )
    db.add(bs_pattern)

    tree_pattern = Pattern(
        topic_id=topics_map["Trees"].id,
        name="Depth-First Tree Traversal",
        slug="dfs-tree-traversal",
        description="Recursively decompose trees into left and right subtrees with clear base cases.",
        when_to_recognize=json.dumps(["Hierarchical structures", "Path sum verification", "Max depth or diameter calculation"]),
        common_signals=json.dumps(["root", "binary tree", "max depth", "path sum", "subtree", "leaf"]),
        pattern_flow=json.dumps([
            {"step": 1, "title": "Base Case", "desc": "if not root: return 0 or default."},
            {"step": 2, "title": "Subtree Calls", "desc": "left_val = dfs(root.left), right_val = dfs(root.right)"},
            {"step": 3, "title": "Combine", "desc": "return aggregate(left_val, right_val) + root.val"}
        ]),
        time_complexity="O(N)",
        space_complexity="O(H)",
        implementation_structure="""def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))""",
        common_mistakes="Missing base case for null nodes causing RecursionError.",
        order_index=1,
        status="Not Started"
    )
    db.add(tree_pattern)

    graph_pattern = Pattern(
        topic_id=topics_map["Graphs"].id,
        name="Breadth-First Search (Shortest Path)",
        slug="bfs-graph",
        description="Level-order exploration of unweighted graphs using a FIFO queue and a visited set.",
        when_to_recognize=json.dumps(["Shortest path in unweighted graphs", "Connected components", "Multi-source spread simulation"]),
        common_signals=json.dumps(["minimum steps", "shortest path", "queue", "levels", "grid rotten oranges"]),
        pattern_flow=json.dumps([
            {"step": 1, "title": "Initialize Queue", "desc": "queue = deque([start_node]), visited = {start_node}"},
            {"step": 2, "title": "Process Level", "desc": "Pop front, examine neighbors, push unvisited neighbors to queue."},
            {"step": 3, "title": "Target Check", "desc": "If target reached, return step_count."}
        ]),
        time_complexity="O(V + E)",
        space_complexity="O(V)",
        implementation_structure="""from collections import deque
def bfs(graph, start, target):
    queue = deque([(start, 0)])
    visited = {start}
    while queue:
        node, dist = queue.popleft()
        if node == target:
            return dist
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    return -1""",
        common_mistakes="Adding nodes to visited when popping rather than when enqueueing, causing duplicate queue entries.",
        order_index=1,
        status="Not Started"
    )
    db.add(graph_pattern)
    db.commit()

    # 4. Curated 3 Easy, 3 Medium, 3 Hard Problems for Sliding Window (The core showcase!)
    sliding_window_problems = [
        # Easy 1
        {
            "title": "Maximum Sum Subarray of Size K",
            "slug": "maximum-sum-subarray-of-size-k",
            "difficulty": "Easy",
            "estimated_time": "15 mins",
            "description": "Given an array of integers `nums` and a positive integer `k`, find the maximum sum of any contiguous subarray of size `k`.\n\nContiguous means elements must be sequential in memory without skipping.",
            "examples": json.dumps([
                {"input": "nums = [2, 1, 5, 1, 3, 2], k = 3", "output": "9", "explanation": "Subarray with maximum sum is [5, 1, 3] with sum 9."},
                {"input": "nums = [2, 3, 4, 1, 5], k = 2", "output": "7", "explanation": "Subarray [3, 4] gives maximum sum 7."}
            ]),
            "constraints": json.dumps([
                "1 <= nums.length <= 10^5",
                "-10^4 <= nums[i] <= 10^4",
                "1 <= k <= nums.length"
            ]),
            "starter_code": """def max_sub_array_of_size_k(k: int, nums: list[int]) -> int:
    # TODO: Implement using Sliding Window
    # Hint: Maintain the sum of a window of size k
    pass""",
            "test_cases": json.dumps([
                {"input": "k = 3, nums = [2, 1, 5, 1, 3, 2]", "expected": "9"},
                {"input": "k = 2, nums = [2, 3, 4, 1, 5]", "expected": "7"},
                {"input": "k = 1, nums = [4]", "expected": "4"}
            ]),
            "hints": [
                {"level": 1, "type": "Conceptual", "content": "Notice how each window of size k shares k-1 elements with the neighboring window."},
                {"level": 2, "type": "Directional", "content": "Instead of recalculating the sum of k elements every time, can you subtract the leaving element and add the entering element?"},
                {"level": 3, "type": "Pattern-level", "content": "This is a fixed-size Sliding Window of length k. The window never needs to grow beyond k."},
                {"level": 4, "type": "Algorithmic", "content": "Sum the first k elements. Then loop from index k to len(nums)-1: window_sum += nums[i] - nums[i - k]. Keep track of max."},
                {"level": 5, "type": "Detailed", "content": "Return max_sum after finishing the single O(N) pass. Auxiliary space is O(1)."}
            ]
        },
        # Easy 2
        {
            "title": "Subarrays of Average Greater Than or Equal to Threshold",
            "slug": "subarrays-average-threshold",
            "difficulty": "Easy",
            "estimated_time": "15 mins",
            "description": "Given an array of integers `nums` and two integers `k` and `threshold`, return the number of sub-arrays of size `k` and average greater than or equal to `threshold`.",
            "examples": json.dumps([
                {"input": "nums = [2, 2, 2, 2, 5, 5, 5, 8], k = 3, threshold = 4", "output": "3", "explanation": "Subarrays [2,5,5], [5,5,5], and [5,5,8] have averages 4, 5, and 6 respectively."}
            ]),
            "constraints": json.dumps(["1 <= nums.length <= 10^5", "1 <= k <= nums.length", "0 <= threshold <= 10^4"]),
            "starter_code": """def num_of_subarrays(nums: list[int], k: int, threshold: int) -> int:
    target_sum = k * threshold
    count = 0
    # Complete sliding window
    pass""",
            "test_cases": json.dumps([
                {"input": "nums = [2, 2, 2, 2, 5, 5, 5, 8], k = 3, threshold = 4", "expected": "3"}
            ]),
            "hints": [
                {"level": 1, "type": "Conceptual", "content": "Checking average >= threshold is mathematically equivalent to checking sum >= k * threshold."},
                {"level": 2, "type": "Directional", "content": "Compute the sum of first k elements. Count 1 if sum >= target_sum."},
                {"level": 3, "type": "Pattern-level", "content": "Slide the window by adding nums[i] and removing nums[i - k]."},
                {"level": 4, "type": "Algorithmic", "content": "Iterate from k to n-1, updating the sum in O(1) and incrementing count whenever sum >= target_sum."},
                {"level": 5, "type": "Detailed", "content": "Return count at the end. Total time O(N), Space O(1)."}
            ]
        },
        # Easy 3
        {
            "title": "Maximum Number of Vowels in a Substring of Given Length",
            "slug": "max-vowels-substring-k",
            "difficulty": "Easy",
            "estimated_time": "15 mins",
            "description": "Given a string `s` and an integer `k`, return the maximum number of vowel letters in any substring of `s` with length `k`.\n\nVowel letters in English are 'a', 'e', 'i', 'o', and 'u'.",
            "examples": json.dumps([
                {"input": "s = 'abciiidef', k = 3", "output": "3", "explanation": "The substring 'iii' contains 3 vowel letters."}
            ]),
            "constraints": json.dumps(["1 <= s.length <= 10^5", "1 <= k <= s.length"]),
            "starter_code": """def max_vowels(s: str, k: int) -> int:
    vowels = set('aeiou')
    # Track vowels in sliding window of size k
    pass""",
            "test_cases": json.dumps([
                {"input": "s = 'abciiidef', k = 3", "expected": "3"}
            ]),
            "hints": [
                {"level": 1, "type": "Conceptual", "content": "Fixed window of size k on a string."},
                {"level": 2, "type": "Directional", "content": "Count vowels in the initial k characters."},
                {"level": 3, "type": "Pattern-level", "content": "When sliding the window rightward, check if the departing character was a vowel and if the new character is a vowel."},
                {"level": 4, "type": "Algorithmic", "content": "curr_vowels += (s[i] in vowels) - (s[i-k] in vowels). Update max_vowels."},
                {"level": 5, "type": "Detailed", "content": "Early exit if max_vowels reaches k."}
            ]
        },
        # Medium 1
        {
            "title": "Longest Substring Without Repeating Characters",
            "slug": "longest-substring-without-repeating-characters",
            "difficulty": "Medium",
            "estimated_time": "25 mins",
            "description": "Given a string `s`, find the length of the longest substring without duplicate characters.\n\nA substring is a contiguous non-empty sequence of characters within a string.",
            "examples": json.dumps([
                {"input": "s = 'abcabcbb'", "output": "3", "explanation": "The answer is 'abc', with the length of 3."},
                {"input": "s = 'bbbbb'", "output": "1", "explanation": "The answer is 'b', with the length of 1."}
            ]),
            "constraints": json.dumps(["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."]),
            "starter_code": """def length_of_longest_substring(s: str) -> int:
    # Use dynamic sliding window with a character index map
    seen = {}
    left = 0
    max_len = 0
    pass""",
            "test_cases": json.dumps([
                {"input": "s = 'abcabcbb'", "expected": "3"},
                {"input": "s = 'bbbbb'", "expected": "1"},
                {"input": "s = 'pwwkew'", "expected": "3"}
            ]),
            "hints": [
                {"level": 1, "type": "Conceptual", "content": "As you expand the window with the right pointer, how can you know if the character was already encountered?"},
                {"level": 2, "type": "Directional", "content": "Use a hash map or hash set to record the last seen index of each character."},
                {"level": 3, "type": "Pattern-level", "content": "This is a dynamic-size sliding window. If a duplicate character is seen at index `last_idx >= left`, contract the window by jumping `left = last_idx + 1`."},
                {"level": 4, "type": "Algorithmic", "content": "At each right pointer: if s[right] in seen and seen[s[right]] >= left: left = seen[s[right]] + 1. Then seen[s[right]] = right. Update max_len = max(max_len, right - left + 1)."},
                {"level": 5, "type": "Detailed", "content": "Time complexity: O(N) since each character is visited at most twice. Space complexity: O(min(N, M)) where M is the alphabet size."}
            ]
        },
        # Medium 2
        {
            "title": "Minimum Size Subarray Sum",
            "slug": "minimum-size-subarray-sum",
            "difficulty": "Medium",
            "estimated_time": "25 mins",
            "description": "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to `target`. If there is no such subarray, return 0.",
            "examples": json.dumps([
                {"input": "target = 7, nums = [2, 3, 1, 2, 4, 3]", "output": "2", "explanation": "The subarray [4, 3] has minimal length 2 under the problem constraint."}
            ]),
            "constraints": json.dumps(["1 <= target <= 10^9", "1 <= nums.length <= 10^5", "1 <= nums[i] <= 10^4"]),
            "starter_code": """def min_sub_array_len(target: int, nums: list[int]) -> int:
    left = 0
    curr_sum = 0
    min_len = float('inf')
    # Implement dynamic shrinking window
    pass""",
            "test_cases": json.dumps([
                {"input": "target = 7, nums = [2, 3, 1, 2, 4, 3]", "expected": "2"},
                {"input": "target = 4, nums = [1, 4, 4]", "expected": "1"},
                {"input": "target = 11, nums = [1, 1, 1, 1, 1]", "expected": "0"}
            ]),
            "hints": [
                {"level": 1, "type": "Conceptual", "content": "All numbers are positive! That means adding elements always increases the sum, and dropping elements always decreases it."},
                {"level": 2, "type": "Directional", "content": "Expand the right pointer until the sum is >= target. Once it is, you've found a candidate! Can you make it shorter?"},
                {"level": 3, "type": "Pattern-level", "content": "While sum >= target, update min_len = min(min_len, right - left + 1) and shrink left += 1."},
                {"level": 4, "type": "Algorithmic", "content": "Loop right from 0 to n-1. curr_sum += nums[right]. While curr_sum >= target: update min_len; curr_sum -= nums[left]; left += 1."},
                {"level": 5, "type": "Detailed", "content": "Return min_len if min_len != infinity else 0. Time is O(N), Space is O(1)."}
            ]
        },
        # Medium 3
        {
            "title": "Longest Repeating Character Replacement",
            "slug": "longest-repeating-character-replacement",
            "difficulty": "Medium",
            "estimated_time": "30 mins",
            "description": "You are given a string `s` consisting of only uppercase English letters and an integer `k`. You can choose up to `k` characters of the string and replace them with any other uppercase English character.\n\nReturn the length of the longest substring containing the same letter you can get after performing the operations.",
            "examples": json.dumps([
                {"input": "s = 'ABAB', k = 2", "output": "4", "explanation": "Replace the two 'A's with two 'B's or vice versa to get 'BBBB'."},
                {"input": "s = 'AABABBA', k = 1", "output": "4", "explanation": "Replace the middle 'A' to get 'AABBBBA' (subsegment 'BBBB' length 4)."}
            ]),
            "constraints": json.dumps(["1 <= s.length <= 10^5", "0 <= k <= s.length"]),
            "starter_code": """def character_replacement(s: str, k: int) -> int:
    count = {}
    left = 0
    max_f = 0
    max_len = 0
    # Sliding window tracking max frequency
    pass""",
            "test_cases": json.dumps([
                {"input": "s = 'ABAB', k = 2", "expected": "4"},
                {"input": "s = 'AABABBA', k = 1", "expected": "4"}
            ]),
            "hints": [
                {"level": 1, "type": "Conceptual", "content": "In any valid window, the number of characters we must replace is: (window length) - (frequency of the most common character)."},
                {"level": 2, "type": "Directional", "content": "If (right - left + 1) - max_frequency > k, the window has become invalid."},
                {"level": 3, "type": "Pattern-level", "content": "When invalid, shrink from the left by decrementing count[s[left]] and advancing left += 1."},
                {"level": 4, "type": "Algorithmic", "content": "Notice max_frequency does not strictly need to be decremented because a smaller max_freq will never yield a longer valid window than our current best."},
                {"level": 5, "type": "Detailed", "content": "Time is O(N) with at most 26 keys in hash map, space O(1)."}
            ]
        },
        # Hard 1
        {
            "title": "Sliding Window Maximum",
            "slug": "sliding-window-maximum",
            "difficulty": "Hard",
            "estimated_time": "40 mins",
            "description": "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window values as an array.",
            "examples": json.dumps([
                {"input": "nums = [1,3,-1,-3,5,3,6,7], k = 3", "output": "[3,3,5,5,6,7]", "explanation": "Window positions: [1 3 -1] -> 3, [3 -1 -3] -> 3, [-1 -3 5] -> 5, [-3 5 3] -> 5, [5 3 6] -> 6, [3 6 7] -> 7."}
            ]),
            "constraints": json.dumps(["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "1 <= k <= nums.length"]),
            "starter_code": """from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    # Monotonic decreasing deque storing indices
    q = deque()
    res = []
    pass""",
            "test_cases": json.dumps([
                {"input": "nums = [1,3,-1,-3,5,3,6,7], k = 3", "expected": "[3, 3, 5, 5, 6, 7]"}
            ]),
            "hints": [
                {"level": 1, "type": "Conceptual", "content": "A naive search inside each window takes O(N * k). Can we maintain the maximum in O(1) amortized time?"},
                {"level": 2, "type": "Directional", "content": "If a newly entering element is greater than older elements in the window, those older smaller elements will never be the maximum again!"},
                {"level": 3, "type": "Pattern-level", "content": "Use a Monotonic Decreasing Deque that stores indices. The front always holds the index of the maximum element for the current window."},
                {"level": 4, "type": "Algorithmic", "content": "While q and nums[q[-1]] <= nums[i]: q.pop(). Then append index i. If q[0] <= i - k: q.popleft(). If i >= k - 1: res.append(nums[q[0]])."},
                {"level": 5, "type": "Detailed", "content": "Each index is enqueued and dequeued at most once: strictly O(N) time and O(K) extra space."}
            ]
        },
        # Hard 2
        {
            "title": "Minimum Window Substring",
            "slug": "minimum-window-substring",
            "difficulty": "Hard",
            "estimated_time": "45 mins",
            "description": "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `\"\"`.",
            "examples": json.dumps([
                {"input": "s = 'ADOBECODEBANC', t = 'ABC'", "output": "'BANC'", "explanation": "The minimum window substring 'BANC' includes 'A', 'B', and 'C' from string t."}
            ]),
            "constraints": json.dumps(["1 <= s.length, t.length <= 10^5", "s and t consist of uppercase and lowercase English letters."]),
            "starter_code": """def min_window(s: str, t: str) -> str:
    # Track character counts with target match counters
    from collections import Counter
    target_counts = Counter(t)
    pass""",
            "test_cases": json.dumps([
                {"input": "s = 'ADOBECODEBANC', t = 'ABC'", "expected": "BANC"}
            ]),
            "hints": [
                {"level": 1, "type": "Conceptual", "content": "You need all characters from t inside your window, with at least the counts specified in t."},
                {"level": 2, "type": "Directional", "content": "Keep a `formed` variable tracking how many unique characters in t have met their frequency requirement."},
                {"level": 3, "type": "Pattern-level", "content": "Expand with right pointer until `formed == required`. Once valid, greedily contract with left pointer while keeping formed == required to find the shortest substring."},
                {"level": 4, "type": "Algorithmic", "content": "Whenever valid: record (right - left + 1) if smaller than current best, then decrement count of s[left], advance left += 1, and update formed if condition breaks."},
                {"level": 5, "type": "Detailed", "content": "O(|S| + |T|) time complexity and O(|S| + |T|) space."}
            ]
        },
        # Hard 3
        {
            "title": "Substring with Concatenation of All Words",
            "slug": "substring-concatenation-all-words",
            "difficulty": "Hard",
            "estimated_time": "45 mins",
            "description": "You are given a string `s` and an array of strings `words`. All the strings of `words` are of the same length.\n\nA concatenated substring in `s` is a substring that contains all the strings of any permutation of `words` concatenated.\n\nReturn the starting indices of all the concatenated substrings in `s`.",
            "examples": json.dumps([
                {"input": "s = 'barfoothefoobarman', words = ['foo','bar']", "output": "[0, 9]", "explanation": "Substrings starting at 0 ('barfoo') and 9 ('foobar') are permutations of words."}
            ]),
            "constraints": json.dumps(["1 <= s.length <= 10^4", "1 <= words.length <= 5000", "1 <= words[i].length <= 30"]),
            "starter_code": """def find_substring(s: str, words: list[str]) -> list[int]:
    from collections import Counter
    if not s or not words:
        return []
    word_len = len(words[0])
    pass""",
            "test_cases": json.dumps([
                {"input": "s = 'barfoothefoobarman', words = ['foo','bar']", "expected": "[0, 9]"}
            ]),
            "hints": [
                {"level": 1, "type": "Conceptual", "content": "Since every word in words has the exact same length L, you can slide a window of size L chunks!"},
                {"level": 2, "type": "Directional", "content": "Run L independent sliding windows, starting at offsets 0, 1, ..., L-1."},
                {"level": 3, "type": "Pattern-level", "content": "Slide by word_len at each step. Use a frequency map to count valid words in the current window."},
                {"level": 4, "type": "Algorithmic", "content": "If an invalid word appears, reset left pointer to right. If a word exceeds count, shrink left by word_len until counts match."},
                {"level": 5, "type": "Detailed", "content": "Total runtime is O(L * (N / L)) = O(N) string hashing. Returns list of starting indices."}
            ]
        }
    ]

    for p_idx, prob in enumerate(sliding_window_problems):
        p_obj = Problem(
            pattern_id=sw_pattern.id,
            title=prob["title"],
            slug=prob["slug"],
            difficulty=prob["difficulty"],
            estimated_time=prob["estimated_time"],
            description=prob["description"],
            examples=prob["examples"],
            constraints=prob["constraints"],
            starter_code=prob["starter_code"],
            test_cases=prob["test_cases"],
            order_index=p_idx + 1
        )
        db.add(p_obj)
        db.commit()
        db.refresh(p_obj)

        for h in prob["hints"]:
            hint_obj = Hint(
                problem_id=p_obj.id,
                hint_level=h["level"],
                clue_type=h["type"],
                content=h["content"]
            )
            db.add(hint_obj)

        # Mark 4 problems as completed to match prompt: "4 / 9 Problems"
        if p_idx < 4:
            prog = Progress(
                user_id=user.id,
                problem_id=p_obj.id,
                status="completed",
                last_code=prob["starter_code"]
            )
            db.add(prog)
            sub = Submission(
                user_id=user.id,
                problem_id=p_obj.id,
                code=prob["starter_code"],
                status="Accepted",
                runtime_ms=35,
                memory_mb=16.1,
                passed_tests=3,
                total_tests=3
            )
            db.add(sub)

    db.commit()

    # 5. Companies (Google, Microsoft, Amazon, TCS, Infosys, Wipro, Accenture)
    companies_data = [
        {
            "name": "Google",
            "slug": "google",
            "desc": "Focuses heavily on algorithmic optimization, tree and graph models, dynamic programming invariants, and clean architectural explanations.",
            "roles": json.dumps(["Software Engineer (L3/L4)", "Site Reliability Engineer", "Systems Engineer"]),
            "focus": json.dumps([
                {"topic": "Arrays & Sliding Window", "coverage": 100},
                {"topic": "Hashing & HashMaps", "coverage": 80},
                {"topic": "Trees & Binary Search Trees", "coverage": 60},
                {"topic": "Graphs & Topological Sort", "coverage": 40},
                {"topic": "Dynamic Programming", "coverage": 20},
                {"topic": "Binary Search on Monotonic Space", "coverage": 70}
            ]),
            "questions": [
                {"title": "Longest Substring with At Most K Distinct Characters", "diff": "Medium", "topic": "Strings", "pattern": "Sliding Window", "source": "Community Reported (LeetCode/Glassdoor)", "freq": "Very High"},
                {"title": "Snapshot Array with Historic Versioning", "diff": "Medium", "topic": "Binary Search", "pattern": "Binary Search on Array", "source": "Official Practice Framework", "freq": "High"},
                {"title": "Word Ladder II Shortest Transformation Sequence", "diff": "Hard", "topic": "Graphs", "pattern": "BFS Shortest Path", "source": "Community Interview Log", "freq": "Medium"},
                {"title": "Meeting Rooms II Conflicting Interval Allocation", "diff": "Medium", "topic": "Greedy", "pattern": "Two Pointers / Min-Heap", "source": "Community Interview Log", "freq": "Very High"}
            ]
        },
        {
            "name": "Microsoft",
            "slug": "microsoft",
            "desc": "Emphasizes foundational data structures, string manipulation, linked list pointer integrity, trees, and system logic clarity.",
            "roles": json.dumps(["Software Engineer", "Cloud Engineer", "Backend Developer"]),
            "focus": json.dumps([
                {"topic": "Arrays & Strings", "coverage": 90},
                {"topic": "Linked Lists & Pointers", "coverage": 85},
                {"topic": "Binary Trees & BST", "coverage": 70},
                {"topic": "Dynamic Programming", "coverage": 30}
            ]),
            "questions": [
                {"title": "Reverse Nodes in k-Group", "diff": "Hard", "topic": "Linked List", "pattern": "In-place Reversal", "source": "Community Reported", "freq": "High"},
                {"title": "Sign of the Product of an Array", "diff": "Easy", "topic": "Arrays", "pattern": "Basic Traversal", "source": "Interview Experience", "freq": "Very High"},
                {"title": "Binary Tree Zigzag Level Order Traversal", "diff": "Medium", "topic": "Trees", "pattern": "BFS with Deque", "source": "Community Reported", "freq": "High"}
            ]
        },
        {
            "name": "Amazon",
            "slug": "amazon",
            "desc": "Strong emphasis on Leadership Principles paired with medium-to-hard coding problems in trees, graphs, heaps, and arrays.",
            "roles": json.dumps(["AI Engineer I (SDE-1)", "SDE-2", "DevOps Engineer"]),
            "focus": json.dumps([
                {"topic": "Arrays & Two Pointers", "coverage": 85},
                {"topic": "Trees & BFS", "coverage": 75},
                {"topic": "Graphs & BFS/DFS", "coverage": 65},
                {"topic": "Priority Queue / Heaps", "coverage": 50}
            ]),
            "questions": [
                {"title": "K Closest Points to Origin", "diff": "Medium", "topic": "Heap", "pattern": "Top K Elements", "source": "Verified Candidate Experience", "freq": "Very High"},
                {"title": "Rotting Oranges Grid Infection", "diff": "Medium", "topic": "Graphs", "pattern": "Multi-source BFS", "source": "Community Reported", "freq": "Very High"},
                {"title": "Analyze User Website Visit Pattern", "diff": "Medium", "topic": "Hashing", "pattern": "Complement & Combinations", "source": "Candidate Debrief", "freq": "High"}
            ]
        },
        {
            "name": "TCS",
            "slug": "tcs",
            "desc": "TCS Digital / Ninja rounds focus on core array manipulation, basic mathematics, string parsing, and clean modular code.",
            "roles": json.dumps(["TCS Digital Software Engineer", "TCS Ninja Systems Engineer"]),
            "focus": json.dumps([
                {"topic": "Arrays & Strings", "coverage": 95},
                {"topic": "Basic Math & Hashing", "coverage": 90},
                {"topic": "Two Pointers", "coverage": 60}
            ]),
            "questions": [
                {"title": "Move All Zeros to End of Array", "diff": "Easy", "topic": "Arrays", "pattern": "Two Pointers", "source": "TCS Digital Exam Syllabus", "freq": "Very High"},
                {"title": "Check for Palindromic String with Special Chars", "diff": "Easy", "topic": "Strings", "pattern": "Two Pointers", "source": "Past Placement Papers", "freq": "High"}
            ]
        },
        {
            "name": "Infosys",
            "slug": "infosys",
            "desc": "Infosys SP (Specialist Programmer) and DSE (Digital Specialist Engineer) exams feature dynamic programming, greedy, and graph traversals.",
            "roles": json.dumps(["Specialist Programmer (SP)", "Digital Specialist Engineer (DSE)"]),
            "focus": json.dumps([
                {"topic": "Arrays & Dynamic Programming", "coverage": 75},
                {"topic": "Greedy Algorithms", "coverage": 70},
                {"topic": "Strings & Hashing", "coverage": 80}
            ]),
            "questions": [
                {"title": "Longest Increasing Subsequence Variation", "diff": "Medium", "topic": "Dynamic Programming", "pattern": "State Memoization", "source": "InfyTQ Placement Drive", "freq": "High"},
                {"title": "Maximum Circular Subarray Sum", "diff": "Medium", "topic": "Arrays", "pattern": "Kadane's Algorithm", "source": "Infosys SP Drive", "freq": "Very High"}
            ]
        },
        {
            "name": "Wipro",
            "slug": "wipro",
            "desc": "Wipro Elite National Talent Hunt focuses on arrays, strings, basic recursion, and search fundamentals.",
            "roles": json.dumps(["Project Engineer", "Turbo Developer"]),
            "focus": json.dumps([
                {"topic": "Arrays & Search", "coverage": 85},
                {"topic": "Strings", "coverage": 80}
            ]),
            "questions": [
                {"title": "Find the Missing Number in Arithmetic Sequence", "diff": "Easy", "topic": "Arrays", "pattern": "Binary Search", "source": "Wipro NLTH Archive", "freq": "High"}
            ]
        },
        {
            "name": "Accenture",
            "slug": "accenture",
            "desc": "Accenture Advanced Technical Assessment tests string manipulations, bitwise tricks, array partitioning, and matrix traversals.",
            "roles": json.dumps(["Associate Software Engineer", "Advanced ASE"]),
            "focus": json.dumps([
                {"topic": "Arrays & Matrices", "coverage": 85},
                {"topic": "Strings & Bitwise", "coverage": 75}
            ]),
            "questions": [
                {"title": "Large Small Sum Difference Calculation", "diff": "Easy", "topic": "Arrays", "pattern": "Basic Traversal", "source": "Accenture National Drive", "freq": "High"}
            ]
        }
    ]

    for c in companies_data:
        comp_obj = Company(
            name=c["name"],
            slug=c["slug"],
            description=c["desc"],
            target_roles=c["roles"],
            interview_focus=c["focus"]
        )
        db.add(comp_obj)
        db.commit()
        db.refresh(comp_obj)

        for q in c["questions"]:
            cq = CompanyQuestion(
                company_id=comp_obj.id,
                title=q["title"],
                difficulty=q["diff"],
                topic_name=q["topic"],
                pattern_name=q["pattern"],
                source=q["source"],
                frequency=q["freq"]
            )
            db.add(cq)

    # 6. Pattern Recognition Test Questions
    # Key requirement: Test if student can identify pattern without revealing it!
    pattern_questions = [
        {
            "title": "Continuous Flight Booking Seat Occupancy",
            "snippet": "You are given a list of flight bookings where each booking is [first_seat, last_seat, seats_reserved]. You need to return the total seats reserved across all n flights in an optimal single pass.",
            "options": json.dumps(["Difference Array / Prefix Sum", "Sliding Window", "Binary Search", "Backtracking"]),
            "correct": "Difference Array / Prefix Sum",
            "explanation": "Range updates [L, R] with an increment of value K applied across an array are solved in O(1) per update using the Difference Array technique (+K at L, -K at R+1), followed by a single prefix sum pass.",
            "signals": "range update [L, R], continuous sequence of seats, offline batch updates"
        },
        {
            "title": "Smallest Window Containing All Characters of Substring",
            "snippet": "Given two strings S and T, find the minimum window in S which will contain all the characters in T in complexity O(n).",
            "options": json.dumps(["Two Pointers (Converging)", "Sliding Window", "Monotonic Stack", "Dynamic Programming"]),
            "correct": "Sliding Window",
            "explanation": "The problem asks for a contiguous substring meeting a dynamic condition with linear time requirements. This is the canonical dynamic Sliding Window with right expansion and left contraction.",
            "signals": "minimum window, substring, contiguous, contains all characters, O(n) requirement"
        },
        {
            "title": "Sorted Array Pair with Target Absolute Difference",
            "snippet": "Given a sorted array of distinct integers and an integer k, return all unique pairs (a, b) such that |a - b| == k.",
            "options": json.dumps(["Sliding Window", "Two Pointers", "Binary Tree DFS", "Breadth First Search"]),
            "correct": "Two Pointers",
            "explanation": "The input is sorted and monotonic. By maintaining two runner pointers moving in the same or opposite directions, we can discard non-matching candidates deterministically in O(N) time.",
            "signals": "sorted array, pairs with target difference, monotonic order"
        },
        {
            "title": "Capacity to Ship Packages Within D Days",
            "snippet": "A conveyor belt has packages that must be shipped within D days in order. What is the minimum ship capacity required?",
            "options": json.dumps(["Backtracking", "Dynamic Programming", "Binary Search on Monotonic Space", "Two Pointers"]),
            "correct": "Binary Search on Monotonic Space",
            "explanation": "If a ship with capacity C can finish in <= D days, then any capacity > C can also finish in <= D days. This monotonic True/False feasibility condition allows binary searching the capacity between max(weights) and sum(weights).",
            "signals": "minimum capacity, monotonic feasibility function, search space bounded by min/max"
        },
        {
            "title": "Longest Substring with At Most K Distinct Characters",
            "snippet": "Given a string s and an integer k, return the length of the longest substring of s that contains at most k distinct characters.",
            "options": json.dumps(["Sliding Window", "Binary Search", "Monotonic Stack", "Greedy"]),
            "correct": "Sliding Window",
            "explanation": "Contiguous substring + longest length + dynamic condition ('at most k distinct') points unambiguously to dynamic Sliding Window with a frequency map.",
            "signals": "longest substring, at most k distinct, frequency tracker"
        }
    ]

    for pq in pattern_questions:
        pq_obj = PatternRecognitionQuestion(
            title=pq["title"],
            problem_snippet=pq["snippet"],
            options=pq["options"],
            correct_pattern=pq["correct"],
            explanation=pq["explanation"],
            key_signals=pq["signals"]
        )
        db.add(pq_obj)

    # 7. Opportunities (Hackathons, Hiring Challenges, Internships, Coding Contests)
    # Labeled Demo Opportunity where applicable
    opportunities_data = [
        {
            "title": "Google Summer of Code (GSoC) 2026",
            "organization": "Google Open Source",
            "category": "Internships",
            "deadline": "April 15, 2026",
            "eligibility": "Open to all enrolled students and tech contributors 18+",
            "skills": "Python, C++, Git, System Architecture, Open Source",
            "official_link": "https://summerofcode.withgoogle.com",
            "is_demo": False,
            "location": "Global / Remote",
            "prize": "Stipend ($1500 - $3000 USD) + Official Mentorship"
        },
        {
            "title": "Flipkart GRiD 7.0 - Software Development Track",
            "organization": "Flipkart",
            "category": "Hiring Challenges",
            "deadline": "May 30, 2026",
            "eligibility": "B.Tech / B.E. / M.Tech students (Batches 2026 & 2027)",
            "skills": "DSA, System Design, Scalable Web Applications",
            "official_link": "https://unstop.com",
            "is_demo": True,
            "location": "Online / Bangalore Finals",
            "prize": "PPI (Pre-Placement Interview) for SDE-1 + INR 5,00,000"
        },
        {
            "title": "Smart India Hackathon (SIH) 2026",
            "organization": "Ministry of Education, Govt. of India",
            "category": "Hackathons",
            "deadline": "July 10, 2026",
            "eligibility": "Undergraduate / Postgraduate college teams of 6 students",
            "skills": "Full-Stack Web, AI/ML, Cloud Computing, DSA",
            "official_link": "https://sih.gov.in",
            "is_demo": True,
            "location": "Nodal Centers Across India",
            "prize": "INR 1,00,000 per problem statement + Incubation support"
        },
        {
            "title": "Amazon Future Engineer Internship Assessment",
            "organization": "Amazon Web Services",
            "category": "Internships",
            "deadline": "August 20, 2026",
            "eligibility": "1st and 2nd Year B.Tech Computer Science / IT students",
            "skills": "Data Structures, Algorithms, Problem Solving in Java/Python",
            "official_link": "https://amazon.jobs",
            "is_demo": True,
            "location": "Hyderabad / Bangalore / Chennai",
            "prize": "Summer Internship + Monthly Stipend INR 80,000"
        },
        {
            "title": "Meta Hacker Cup 2026 - Qualification Round",
            "organization": "Meta Platforms",
            "category": "Coding Contests",
            "deadline": "September 12, 2026",
            "eligibility": "Open globally to all competitive programmers",
            "skills": "Advanced Algorithms, Combinatorics, Graph Theory",
            "official_link": "https://www.facebook.com/codingcompetitions/hacker-cup",
            "is_demo": False,
            "location": "Online",
            "prize": "Top 25 Finals trip to Menlo Park + $20,000 Grand Prize"
        },
        {
            "title": "Microsoft Engage 2026 Mentorship & Internship",
            "organization": "Microsoft India",
            "category": "Technical Challenges",
            "deadline": "October 5, 2026",
            "eligibility": "Pre-final and Final year engineering undergraduates",
            "skills": "DSA, Core CS Concepts, Project Development",
            "official_link": "https://careers.microsoft.com",
            "is_demo": True,
            "location": "Noida / Hyderabad / Remote",
            "prize": "Direct SDE-1 Interview Shortlist + Azure Credits"
        }
    ]

    for opp in opportunities_data:
        opp_obj = Opportunity(
            title=opp["title"],
            organization=opp["organization"],
            category=opp["category"],
            deadline=opp["deadline"],
            eligibility=opp["eligibility"],
            skills=opp["skills"],
            official_link=opp["official_link"],
            is_demo=opp["is_demo"],
            location=opp["location"],
            stipend_or_prize=opp["prize"]
        )
        db.add(opp_obj)

    db.commit()
    db.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_database()
