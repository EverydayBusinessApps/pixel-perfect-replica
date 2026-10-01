import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createLovableAiGatewayRunIdFetch } from "./ai-run-id.server.ts";

export interface AiSpecialIdea {
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  saves: number;
}

const cleanLine = (value: string) => value.replace(/^[-*#\s]+/, "").trim();

function parseSpecial(text: string, selected: { name: string; cost: number }[]): AiSpecialIdea {
  const fields = new Map<string, string>();
  for (const line of text.split("\n")) {
    const divider = line.indexOf(":");
    if (divider < 1) continue;
    fields.set(line.slice(0, divider).trim().toLowerCase(), cleanLine(line.slice(divider + 1)));
  }

  const name = fields.get("name") ?? "";
  const description = fields.get("description") ?? "";
  const ingredientNames = (fields.get("ingredients") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => selected.some((stockItem) => stockItem.name.toLowerCase() === item.toLowerCase()));
  const price = Number((fields.get("price") ?? "").replace(/[^0-9.]/g, ""));

  if (!name || !description || ingredientNames.length === 0 || !Number.isFinite(price) || price <= 0) {
    throw new Error("The idea came back incomplete. Please try again.");
  }

  const saves = selected
    .filter((item) => ingredientNames.some((name) => name.toLowerCase() === item.name.toLowerCase()))
    .reduce((total, item) => total + item.cost, 0);

  return {
    name: name.slice(0, 70),
    description: description.slice(0, 180),
    ingredients: ingredientNames,
    price: Math.round(price * 2) / 2,
    saves,
  };
}

export async function createAiSpecial(
  ingredients: { name: string; qty: string; days: number; cost: number }[],
  direction: string,
) {
  const lovableApiKey = process.env["LOVABLE_API_KEY"];
  if (!lovableApiKey) throw new Error("AI ideas are not configured yet.");

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const openai = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: lovableApiKey,
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: openai.responses("openai/gpt-6-astra"),
    system: "You are a practical Irish café chef. Create one realistic, appealing daily special from the supplied pantry ingredients. Prefer ingredients nearest spoilage. Use only supplied ingredient names in the Ingredients line. Keep the idea feasible for a busy café and the description plain and concise. The suggested price is for a changeable specials board, not a printed menu.",
    prompt: `Pantry ingredients:\n${ingredients.map((item) => `- ${item.name}: ${item.qty}, ${item.days} days left, €${item.cost.toFixed(2)} purchase value`).join("\n")}\nOwner's direction: ${direction || "No direction — surprise me."}\n\nReturn exactly five plain lines:\nName: short dish name\nDescription: one sentence\nIngredients: comma-separated names copied exactly from the pantry list\nPrice: euro amount as a number\nWhy: one short practical reason`,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return parseSpecial(await result.text, ingredients);
}