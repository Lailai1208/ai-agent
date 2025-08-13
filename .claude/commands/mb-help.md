**Usage**: `/mb-help [command-name]` - Display help for Memory Bank commands

**Examples**: 
- `/mb-help` - Show all available Memory Bank commands
- `/mb-help mb-status` - Show help for specific command
- `/mb-help quick` - Show quick reference guide

If "$ARGUMENTS" is empty, display overview of all Memory Bank commands:

## 📚 Memory Bank Commands Help

### Daily Development Commands
- **`/mb-status`** - Project status overview
- **`/mb-tasks [action]`** - Task management (list, add, complete, prioritize)
- **`/mb-log-issue [title]`** - Log and analyze issues

### Knowledge Management Commands  
- **`/mb-save-pattern [type]`** - Save code patterns (hook, component, api, utility)
- **`/mb-log-decision [title]`** - Record architectural decisions
- **`/mb-search [query]`** - Search memory bank content

### Analysis Commands
- **`/mb-review-sprint`** - Sprint retrospective analysis
- **`/mb-help [command]`** - Show command help

### Quick Start Guide
1. **Daily routine**: Start with `/mb-status` to see current project state
2. **Problem solving**: Use `/mb-log-issue "problem description"` when issues arise
3. **Code reuse**: Save good patterns with `/mb-save-pattern [type]` after selecting code
4. **Task tracking**: Manage work with `/mb-tasks [action]`
5. **Sprint review**: End sprints with `/mb-review-sprint` for insights

### Help for Individual Commands
Use `/mb-help [command-name]` or `[command] help` for detailed usage:
- `/mb-help mb-status` or `/mb-status help`
- `/mb-help mb-tasks` or `/mb-tasks help`

If "$ARGUMENTS" is a specific command name, provide detailed help for that command by directing user to use `[command] help` syntax.
