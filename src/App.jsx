import "./App.css";
// 1. import
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// query - getting data from somewhere
// mutation - changing some data (eg. create a brand new post)

const POST = [
  { id: 1, title: "Post 1" },
  { id: 2, title: "Post 2" },
];

function App() {
  console.log(POST);

  // Step 5
  // import queryClient, so that when we useMutataion, it will "invalidate" this data.
  const queryClient = useQueryClient();

  // Step 1.
  // this doesn't refetch automatically.
  // it only pull Post 1 and Post 2
  const postQuery = useQuery({
    queryKey: ["post"], //unique key
    //function to run the query. this is going to run. return an promise.
    queryFn: () => wait(1000).then(() => [...POST]),
  });

  // useMutation to add new post
  // without onSuccess, it is changing our underlying data

  const newPostMutation = useMutation({
    //passing in a single value (title)
    mutationFn: (title) => {
      return wait(1000).then(() =>
        POST.push({ id: crypto.randomUUID(), title })
      );
    },
    //Step 4
    //whenever we have successful data, we are going to invalidate the posts data, we need to use useQueryClient hook
    onSuccess: () => {
      // Step 6
      // invalidate my old post, enter the unique key
      queryClient.invalidateQueries(["post"]);
    },
  });

  //new post mutation is Loading is not a boolean. to use isPending.
  console.log("Mutation isLoading:", newPostMutation.isPending);

  console.log("Post isLoading:", postQuery.isLoading);

  // Step 2
  //state loading when the query is loading.
  if (postQuery.isLoading) return <h1>Loading...</h1>;

  //if not show error
  if (postQuery.isError) {
    return <p>{JSON.stringify(postQuery.error)}</p>;
  }

  // Step 3
  //if we are not loading or showing error, show data
  //disable button is not working
  return (
    <div>
      {postQuery.data.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
      <button
        disabled={newPostMutation.isPending}
        onClick={() => newPostMutation.mutate("New Post")}
      >
        Add New
      </button>
    </div>
  );
}

//wait function
function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
