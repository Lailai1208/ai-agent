**Usage**: `/mb-review-sprint` - Comprehensive sprint retrospective with insights

**Description**: Analyze completed sprint and provide actionable recommendations for improvement.

**Help**: If "$ARGUMENTS" is "help", show this usage information.

Conduct a comprehensive sprint retrospective with insights:

1. **Sprint Completion Analysis**: Review `memory-bank/tasks/current-sprint.md`:
   - Calculate completion percentage
   - Identify completed vs. incomplete tasks
   - Analyze time estimates vs. actual effort
   - Review sprint goals achievement

2. **Learning Extraction**: Analyze memory bank content from sprint period:
   - **Decisions Made**: Review `memory-bank/logs/decisions.md` for sprint decisions
   - **Problems Encountered**: Analyze `memory-bank/logs/failure-analysis.md` for issues and solutions
   - **Experiments Conducted**: Check `memory-bank/logs/experiments/` for technical evaluations
   - **Patterns Discovered**: Review new additions to `memory-bank/knowledge/code-patterns/`

3. **Performance Insights**:
   - **What Went Well**: Successful patterns and approaches
   - **What Could Improve**: Bottlenecks and inefficiencies identified
   - **Blockers Encountered**: External dependencies or technical challenges
   - **Team Velocity**: Task completion rate and accuracy of estimates

4. **Pattern Recognition**:
   - Recurring types of issues and their solutions
   - Most effective development approaches
   - Time estimation accuracy patterns
   - Decision-making effectiveness

5. **Next Sprint Preparation**:
   - Review `memory-bank/tasks/backlog.md` for candidate tasks
   - Suggest sprint goals based on current progress
   - Recommend focus areas for improvement
   - Identify technical debt that should be addressed

6. **Actionable Recommendations**:
   - 3 key areas for improvement in next sprint
   - Specific process adjustments to try
   - Technical investments that would help
   - Documentation or tooling improvements needed
