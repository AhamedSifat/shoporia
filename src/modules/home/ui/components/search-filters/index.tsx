'use client';
import { Categories } from './categories';
import { SearchInput } from './search-input';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export const SearchFilters = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  return (
    <div className='px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full'>
      <SearchInput data={data} />
      <div className='hidden lg:block'>
        <Categories data={data} />
      </div>
    </div>
  );
};
