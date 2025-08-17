import { Category } from '@/payload-types';
import { CategoryDropdown } from './category-dropdown';
import { CustomCategory } from '@/types';

interface Props {
  data: CustomCategory[];
}

export const Categories = ({ data }: Props) => {
  return (
    <div className='relative w-full'>
      <div className='flex flex-nowrap items-center'>
        {data.map((category: Category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category as CustomCategory}
              isActive={false}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>{' '}
    </div>
  );
};
