import { z } from "zod";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const ResponseSchema = z.object({
  created: z.number(),
  data: z
    .array(
      z.object({
        url: z.string(),
      })
    )
    .min(1),
});

export type GenerateImageResponse = z.infer<typeof ResponseSchema>;

const handler = async (req: Request): Promise<Response> => {
  const { prompt } = (await req.json()) as { prompt: string };

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify({
      prompt: prompt,
      n: 1,
      size: "512x512",
    }),
  });
  const body = await res.json();
  const isValid = ResponseSchema.safeParse(body);
  if (isValid.success) {
    return new Response(
      JSON.stringify({ url: isValid.data.data[0].url }, null, 2)
    );
  } else {
    return new Response(JSON.stringify({ error: "Wrong shape data" }, null, 2));
  }
};

export default handler;
