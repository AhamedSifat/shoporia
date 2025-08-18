import { getQueryClient, trpc } from '@/trpc/server';

const Page = async () => {
  const queryClient = getQueryClient();
  const greeting = await queryClient.fetchQuery(
    trpc.categories.getMany.queryOptions()
  );
  return <div>page</div>;
};

export default Page;
