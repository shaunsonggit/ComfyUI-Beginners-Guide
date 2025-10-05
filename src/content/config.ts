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

const site = defineCollection({
  type: "data",
  schema: z.object({
    quickLinks: z
      .object({
        enabled: z.boolean().default(true),
        title: z.string().default("资源速达"),
        items: z
          .array(
            z.object({
              label: z.string(),
              url: z.string(),
              external: z.boolean().default(false),
              icon: z.string().optional()
            })
          )
          .default([])
      })
      .default({ enabled: true, title: "资源速达", items: [] }),
    downloads: z
      .object({
        enabled: z.boolean().default(true),
        title: z.string().default("配套资源下载"),
        description: z.string().optional(),
        items: z
          .array(
            z.object({
              label: z.string(),
              url: z.string(),
              download: z.boolean().default(false)
            })
          )
          .default([])
      })
      .default({ enabled: true, title: "配套资源下载", items: [] })
  })
});

export const collections = { tutorial, site };
