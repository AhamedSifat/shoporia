import { SignInView } from '@/modules/auth/ui/views/sign-in-view';

export const dynamic = 'force-dynamic';

const Page = async () => {
  return <SignInView />;
};

export default Page;
