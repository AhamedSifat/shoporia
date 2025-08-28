import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import z from 'zod';
import type { Sort, Where } from 'payload';
import { Category } from '@/payload-types';

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice: z.number().min(0).optional(),
        maxPrice: z.number().min(0).optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(['curated', 'trending', 'hot_and_new']).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort = '-createdAt';

      if (input.sort === 'curated') {
        sort = '-createdAt';
      }

      if (input.sort === 'hot_and_new') {
        sort = '+createdAt';
      }

      if (input.sort === 'trending') {
        sort = '-createdAt';
      }

      if (input.minPrice && input.maxPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxPrice,
        };
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      } else if (input.maxPrice) {
        where.price = {
          less_than_equal: input.maxPrice,
        };
      }

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

      if (input.tags && input.tags.length > 0) {
        where['tags.slug'] = {
          in: input.tags,
        };
      }

      const data = await ctx.payload.find({
        collection: 'products',
        pagination: false,
        depth: 1, //populate 'category' and 'image
        where,
        sort,
      });

      return data;
    }),
});
