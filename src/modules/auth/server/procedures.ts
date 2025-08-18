import { baseProcedure, createTRPCRouter } from '@/trpc/init';

import { headers as getHeaders, cookies as getCookies } from 'next/headers';
import { loginSchema, registerSchema } from '../schema';
import { TRPCError } from '@trpc/server';

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.payload.auth({ headers });

    return session;
  }),

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const existingData = await ctx.payload.find({
        collection: 'users',
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        },
      });

      const existingUser = existingData.docs[0];

      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'username already taken ',
        });
      }

      await ctx.payload.create({
        collection: 'users',
        data: {
          email: input.email,
          username: input.username,
          password: input.password,
        },
      });

      const data = await ctx.payload.login({
        collection: 'users',
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!data.token) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'failed to login',
        });
      }

      const cookies = await getCookies();
      cookies.set({
        name: 'payload-token',
        value: data.token,
        httpOnly: true,
        path: '/',
        // sameSite: 'none',
        // domain:
      });
    }),

  login: baseProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const data = await ctx.payload.login({
      collection: 'users',
      data: {
        email: input.email,
        password: input.password,
      },
    });

    if (!data.token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'failed to login',
      });
    }

    const cookies = await getCookies();
    cookies.set({
      name: 'payload-token',
      value: data.token,
      httpOnly: true,
      path: '/',
      // sameSite: 'none',
      // domain:
    });

    return data;
  }),

  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();
    cookies.delete('payload-token');
  }),
});
