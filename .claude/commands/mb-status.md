**Usage**: `/mb-status` - Display comprehensive project status from memory bank

**Help**: If "$ARGUMENTS" is "help", show this usage information.

Analyze and display the current project status by examining the memory bank:

1. **Current Sprint Progress**: Read `memory-bank/tasks/current-sprint.md` and summarize:
   - Completed vs remaining tasks
   - Current progress percentage
   - Any blocked or overdue items

2. **Recent Issues** (last 7 days): Check `memory-bank/logs/failure-analysis.md` for:
   - Unresolved problems that need attention
   - Patterns in recent failures
   - Solutions that worked well

3. **Recent Decisions** (last 7 days): Review `memory-bank/logs/decisions.md` for:
   - Key architectural or technical decisions made
   - Impact of recent decisions on current work

4. **Active Experiments**: Check `memory-bank/logs/experiments/` for:
   - Ongoing technical evaluations
   - Experiments ready for conclusion

5. **Next Actions**: Based on the analysis, provide:
   - 3 most important tasks to focus on today
   - Any urgent issues requiring immediate attention
   - Suggestions for improving current workflow

Format the output in a clear, actionable summary that helps prioritize daily development work.
