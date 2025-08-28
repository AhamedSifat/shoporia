'use client';

import { useProductFilters } from '@/hooks/use-product-filters';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

export const ProductList = ({ category }: { category?: string }) => {
  const [filters] = useProductFilters();

  const trpc = useTRPC();
  const { minPrice, maxPrice, ...restFilters } = filters;

  const parsedMinPrice =
    minPrice !== null && minPrice !== undefined && minPrice !== ''
      ? Number(minPrice)
      : undefined;
  const parsedMaxPrice =
    maxPrice !== null && maxPrice !== undefined && maxPrice !== ''
      ? Number(maxPrice)
      : undefined;

  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      category,
      ...restFilters,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
    })
  );

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {data.docs.map((product) => (
        <div key={product.id} className='border rounded-md bg-white'>
          <h2 className='text-lg font-bold'>{product.name}</h2>
          <p className='text-sm text-gray-600'>{product.price}</p>
        </div>
      ))}
    </div>
  );
};
