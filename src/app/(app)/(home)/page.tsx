'use client';
import { useTRPC } from '@/trpc/client';
// <-- hooks can only be used in client components
import { useQuery } from '@tanstack/react-query';

const Page = () => {
  const trpc = useTRPC();
  const greeting = useQuery(trpc.auth.session.queryOptions());
  console.log(greeting.data);
  return <div>page</div>;
};

export default Page;
