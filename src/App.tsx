import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

type User = {
  id: number;
  name: string;
};

const UserList = () => {
  const { data, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json()),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.map(user => (
        <div key={user.id}>
          {user.id}: {user.name}
        </div>
      ))}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserList />
    </QueryClientProvider>
  );
};

export default App;
