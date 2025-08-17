import { Footer } from '@/modules/home/ui/components/footer';
import { Navbar } from '@/modules/home/ui/components/navbar';
import { SearchFilters } from '@/modules/home/ui/components/search-filters';
import { Category } from '@/payload-types';
import { CustomCategory } from '@/types';
import configPromise from '@payload-config';
import { getPayload } from 'payload';

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: 'categories',
    pagination: false,
    depth: 1,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData: CustomCategory[] = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      ...(doc as Category),
    })),
  }));

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className='flex-1 bg-[#F4F4F0]'>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
