**Usage**: `/mb-log-issue [issue-title]` - Guided issue logging with context analysis

**Examples**: 
- `/mb-log-issue "API timeout error"`
- `/mb-log-issue "CORS configuration issue"`
- `/mb-log-issue help` - Show this usage information

**Help**: If "$ARGUMENTS" is "help", show this usage information.

Guide the user through logging a technical issue "$ARGUMENTS" to the memory bank:

1. **Problem Analysis**: Help describe:
   - What exactly happened (symptoms)
   - When it occurred (context/timing)
   - What they were trying to achieve
   - Environment details (browser, OS, etc.)

2. **Historical Context**: Search `memory-bank/logs/failure-analysis.md` for:
   - Similar issues that have occurred before
   - Successful solutions that might apply
   - Patterns that might help identify root cause

3. **Root Cause Investigation**: Help analyze:
   - Potential underlying causes
   - What debugging steps to try
   - Which system components might be involved

4. **Documentation**: Format and append to `memory-bank/logs/failure-analysis.md`:
   ```markdown
   ## 問題: [Issue Title]
   **日期**: YYYY-MM-DD
   **影響範圍**: [前端/後端/全專案]

   ### 現象
   [Detailed problem description]

   ### 根本原因
   [Root cause analysis]

   ### 解決方案
   [Solution steps]

   ### 預防措施
   [Prevention measures]
   ---
   ```

5. **Immediate Next Steps**: Suggest debugging approaches and resources to check.
