import { ProductFilters } from '@/modules/home/ui/components/product-filters';
import { ProductSort } from '@/modules/home/ui/components/product-sort';
import { ProductList } from '@/modules/products/ui/components/product-list';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

interface Props {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    minPrice: string | undefined;
    maxPrice: string | undefined;
    sort: string | undefined;
    [key: string]: string | undefined;
  }>;
}

const Page = async ({ params, searchParams }: Props) => {
  const { category } = await params;
  const { minPrice, maxPrice } = await searchParams;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category,
      minPrice:
        minPrice !== null && minPrice !== undefined && minPrice !== ''
          ? Number(minPrice)
          : undefined,
      maxPrice:
        maxPrice !== null && maxPrice !== undefined && maxPrice !== ''
          ? Number(maxPrice)
          : undefined,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='px-4 lg:px-12 py-8 flex flex-col gap-4'>
        <div className='flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between'>
          <p className='text-2xl font-medium'>Curated for you</p>
          <ProductSort />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12'>
          <div className='lg:col-span-2 xl:col-span-2'>
            <ProductFilters />
          </div>
          <div className='lg:col-span-4 xl:col-span-6'>
            <Suspense fallback={<h1>Loading...</h1>}>
              <ProductList category={category} />
            </Suspense>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default Page;
