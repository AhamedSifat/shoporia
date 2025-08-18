import { baseProcedure, createTRPCRouter } from '@/trpc/init';

import { headers as getHeaders } from 'next/headers';
import { registerSchema } from '../schema';

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.payload.auth({ headers });

    return session;
  }),

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.payload.create({
        collection: 'users',
        data: {
          email: input.email,
          username: input.username,
          password: input.password,
        },
      });
    }),
});
