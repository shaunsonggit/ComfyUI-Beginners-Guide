import { defineCollection, z } from "astro:content";

const tutorial = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    heroImage: z.string().optional(),
    gifDemo: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    goal: z.string().optional(),
    duration: z.string().optional(),
    difficulty: z.string().optional(),
    prerequisites: z.array(z.string()).default([]),
    deliverables: z.array(z.string()).default([]),
    pitfalls: z.array(z.string()).default([]),
    ctaButtons: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
          download: z.boolean().default(false)
        })
      )
      .default([])
  })
});

export const collections = { tutorial };
