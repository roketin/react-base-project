import { useSearchParam } from '@/modules/app/hooks/use-search-param';

const UserIndex = () => {
  const search = useSearchParam();

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>User Management</h1>
      {search && (
        <div className='mb-4 p-3 bg-primary/10 text-primary rounded-md'>
          Searching for: <strong>{search}</strong>
        </div>
      )}
      <p className='text-muted-foreground'>
        This is a sample user index page. Add your user list/table here.
      </p>
      <p className='text-xs text-muted-foreground mt-2'>
        TODO: Use the search query to filter/search user data in your table
      </p>
    </div>
  );
};

export default UserIndex;
