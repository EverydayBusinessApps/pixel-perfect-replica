# Owner-created AI specials

## What will change
- Add a clear **Create your own special** action inside the Home page’s Suggested specials section.
- Open a compact creative workspace where the owner can pick pantry ingredients and add an optional direction such as “something warming” or “quick lunch”.
- Use Lovable AI to produce one practical special with a name, short description, suggested specials-board price, ingredient list, and the stock value it could save.
- Let the owner accept the idea onto the specials board or try another idea; the printed menu remains unchanged.
- Keep the workspace compact and collapsible so it does not make the mobile page unnecessarily long.

## States and safeguards
- Disable generation until at least one ingredient is selected.
- Show clear generating, success, failure, and AI-credit messages while preserving the owner’s choices.
- Keep pantry data and the owner’s creative note private to the server-side AI request.
- AI suggestions will be advisory and visibly editable through another request, not silently applied.

## Technical details
- Add a one-shot TanStack server function using Lovable AI Gateway with `openai/gpt-6-astra` on the Responses API.
- Stream the model call server-side, validate the returned special, and return only the result to the page.
- Add request validation and follow the existing Everyday Business design tokens and Button component.
- Verify generation with a live AI request, then check desktop and mobile layouts plus current error logs.
