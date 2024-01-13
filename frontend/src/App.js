import logo from './logo.svg';
import './App.css';
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools, ReactQueryDevtoolsPanel} from "react-query/devtools";

function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
