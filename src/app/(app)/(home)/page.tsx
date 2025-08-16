import configPromise from '@payload-config';
import { getPayload } from 'payload';

const Page = async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: 'categories',
    depth: 1,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  console.log(data);

  return <div>page</div>;
};

export default Page;
