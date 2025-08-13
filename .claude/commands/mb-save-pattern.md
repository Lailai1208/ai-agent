**Usage**: `/mb-save-pattern [pattern-type]` - Extract and save reusable code patterns

**Pattern Types**: hook, component, api, utility, auto (default)

**Examples**: 
- `/mb-save-pattern hook` - Save selected code as React hook pattern
- `/mb-save-pattern component` - Save as React component pattern
- `/mb-save-pattern api` - Save as API integration pattern
- `/mb-save-pattern` - Auto-detect pattern type
- `/mb-save-pattern help` - Show this usage information

**Help**: If "$ARGUMENTS" is "help", show this usage information.

Extract and save reusable code patterns from selected code as "$ARGUMENTS" type:

1. **Code Analysis**: Examine the selected code in the active editor:
   - Focus on the "$ARGUMENTS" pattern type if specified (hook, component, api, utility)
   - If no type specified, auto-detect the pattern type
   - Identify the pattern type (React hook, utility function, API pattern, etc.)
   - Extract reusable elements and dependencies
   - Determine the appropriate category for storage

2. **Pattern Categories**:
   - React hooks → `memory-bank/knowledge/code-patterns/react-hooks.md`
   - React components → `memory-bank/knowledge/code-patterns/react-components.md`
   - API integration → `memory-bank/knowledge/code-patterns/api-patterns.md`
   - Utility functions → `memory-bank/knowledge/code-patterns/utilities.md`

3. **Documentation Generation**: Create comprehensive documentation:
   - **Pattern Name**: Descriptive title for the pattern
   - **Use Case**: When and why to use this pattern
   - **Code Example**: Clean, well-commented code
   - **Parameters/Props**: Input/output documentation
   - **Dependencies**: Required packages or imports
   - **Usage Example**: How to implement in real scenarios

4. **Integration Check**: 
   - Search existing patterns for duplicates or conflicts
   - Suggest improvements to existing similar patterns

5. **File Updates**: 
   - Append to appropriate pattern file using consistent formatting
   - Update the pattern file's table of contents if present

6. **Usage Guidance**: Provide suggestions for when to apply this pattern in the current project.
