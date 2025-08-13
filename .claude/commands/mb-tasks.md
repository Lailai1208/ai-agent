**Usage**: `/mb-tasks [action]` - Interactive task management interface

**Actions**: list (default), add, complete, prioritize

**Examples**: 
- `/mb-tasks` or `/mb-tasks list` - Show current sprint tasks
- `/mb-tasks add` - Add new task to current sprint
- `/mb-tasks complete` - Mark tasks as completed
- `/mb-tasks prioritize` - Reorder tasks by importance
- `/mb-tasks help` - Show this usage information

**Help**: If "$ARGUMENTS" is "help", show this usage information.

Interactive task management for the current sprint with action "$ARGUMENTS":

1. **Action Processing**: Handle the specified action:
   - If "$ARGUMENTS" is "list" or empty: Display current sprint tasks
   - If "$ARGUMENTS" is "add": Guide through adding new task
   - If "$ARGUMENTS" is "complete": Mark tasks as completed
   - If "$ARGUMENTS" is "prioritize": Help reorder tasks by importance

2. **Current Sprint Analysis**: Read `memory-bank/tasks/current-sprint.md` and provide:
   - Task completion percentage
   - Overdue or blocked tasks
   - Time estimates vs. actual progress
   - Sprint goal alignment

2. **Task Operations**:
   
   **List Tasks**:
   - Show all current sprint tasks with checkboxes
   - Highlight priority items and deadlines
   - Display estimated vs. actual time spent
   
   **Add New Task**:
   - Guide through task description
   - Help estimate effort/time required
   - Suggest priority level based on current sprint goals
   - Assign to appropriate sprint section
   
   **Complete Tasks**:
   - Update task status in current-sprint.md
   - Move completed items to appropriate section
   - Calculate updated sprint progress
   
   **Prioritize Tasks**:
   - Review current task order
   - Suggest reordering based on dependencies and value
   - Update task list with new priorities

3. **Sprint Health Check**:
   - Analyze if sprint goals are achievable
   - Identify bottlenecks or blockers
   - Suggest scope adjustments if needed
   - Recommend focus areas for remaining time

4. **Automated Updates**: 
   - Update `memory-bank/tasks/current-sprint.md` with changes
   - Maintain proper markdown formatting and structure
   - Preserve task metadata (estimates, assignees, etc.)
