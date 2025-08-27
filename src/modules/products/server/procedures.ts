import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import z from 'zod';
import type { Where } from 'payload';
import { Category } from '@/payload-types';

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      if (input.category) {
        const categoryData = await ctx.payload.find({
          collection: 'categories',
          pagination: false,
          limit: 1,
          depth: 1,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });

        const formattedData = categoryData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category),
          })),
        }));

        const parentCategory = formattedData[0];
        const subcategoriesSlugs = [];

        if (parentCategory) {
          subcategoriesSlugs.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug
            )
          );
          where['category.slug'] = {
            in: [parentCategory.slug, ...subcategoriesSlugs],
          };
        }
      }

      const data = await ctx.payload.find({
        collection: 'products',
        pagination: false,
        depth: 1, //populate 'category' and 'image
        where,
      });

      return data;
    }),
});
