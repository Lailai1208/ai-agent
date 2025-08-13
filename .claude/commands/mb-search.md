**Usage**: `/mb-search [query]` - Search through memory bank for information

**Examples**: 
- `/mb-search "API error handling"` - Search for API error solutions
- `/mb-search "React hooks"` - Find React hook patterns
- `/mb-search "CORS"` - Look for CORS-related issues
- `/mb-search help` - Show this usage information

**Help**: If "$ARGUMENTS" is "help", show this usage information.

Search through the memory bank for information related to "$ARGUMENTS":

1. **Comprehensive Search**: Look for "$ARGUMENTS" across all memory bank files:
   - Search `memory-bank/knowledge/` for relevant patterns and decisions
   - Check `memory-bank/logs/decisions.md` for related decisions
   - Review `memory-bank/logs/failure-analysis.md` for similar issues
   - Examine `memory-bank/tasks/` for related tasks or ideas

2. **Context Analysis**: For each match found:
   - Provide the file location and context
   - Summarize the relevant information
   - Highlight key insights or solutions

3. **Related Findings**: Identify:
   - Similar patterns or issues that might be relevant
   - Connected decisions or experiments
   - Useful code patterns or solutions

4. **Actionable Insights**: Based on search results:
   - Suggest how the found information applies to current work
   - Recommend next steps based on historical solutions
   - Identify knowledge gaps that need attention

5. **Quick Access**: Provide direct references to:
   - Specific files containing detailed information
   - Related patterns that could be reused
   - Previous solutions that proved effective
