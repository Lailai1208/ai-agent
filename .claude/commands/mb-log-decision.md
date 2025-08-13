**Usage**: `/mb-log-decision [decision-title]` - Record architectural decisions

**Examples**: 
- `/mb-log-decision "選擇 Redis 作為快取解決方案"`
- `/mb-log-decision "採用 TanStack Query 管理伺服器狀態"`
- `/mb-log-decision help` - Show this usage information

**Help**: If "$ARGUMENTS" is "help", show this usage information.

Help record the architectural or technical decision "$ARGUMENTS" to the memory bank:

1. **Decision Type Determination**:
   - Quick decisions: Log to `memory-bank/logs/decisions.md`
   - Formal architectural decisions: Create new ADR in `memory-bank/knowledge/architectural-decisions/`

2. **Context Gathering**: Guide user through:
   - Background: What situation requires a decision?
   - Options: What alternatives were considered?
   - Constraints: What limitations influenced the choice?
   - Impact: Who/what is affected by this decision?

3. **Quick Decision Format** (for decisions.md):
   ```markdown
   **日期**: YYYY-MM-DD
   **決策**: [Title]
   **原因**: [Why this choice]
   **影響**: [Expected consequences]
   ---
   ```

4. **Formal ADR Format** (for architectural decisions):
   - Create file: `YYYY-MM-DD-[slug-title].md`
   - Use ADR template with: Status, Context, Options, Decision, Consequences
   - Include implementation details and trade-offs

5. **Follow-up Actions**: Suggest:
   - Documentation updates needed
   - Code changes required
   - Team communication necessary
