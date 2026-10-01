import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  ingredients: z.array(z.object({
    name: z.string(),
    qty: z.string(),
    days: z.number(),
    cost: z.number(),
  })),
  direction: z.string(),
});

export const suggestOwnerSpecial = createServerFn({ method: "POST" })
  .inputValidator((input) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const selected = data.ingredients.slice(0, 8);
    if (selected.length === 0) throw new Error("Choose at least one pantry item.");

    const { createAiSpecial } = await import("./special-ai.server.ts");
    try {
      return await createAiSpecial(selected, data.direction.trim().slice(0, 240));
    } catch (error) {
      const status = typeof error === "object" && error && "statusCode" in error
        ? Number(error.statusCode)
        : undefined;
      const message = error instanceof Error ? error.message : "AI could not create an idea right now.";
      if (status === 402) throw new Error(message);
      if (status === 403) throw new Error(message);
      if (status === 429 || (status !== undefined && status >= 500)) {
        throw new Error("AI is busy right now. Please wait a moment and try again.");
      }
      throw new Error(message);
    }
  });