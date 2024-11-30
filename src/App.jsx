import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalContextProvider from "./GlobalContext";
import Layout from "./components/Layout";
import NoPAT from "./components/NoPAT";
import BulkRepoCreator from "./pages/BulkRepoCreator";
import BulkCollaboratorAdd from "./pages/BulkCollaboratorAdd";
import UserRemoveAllRepos from "./pages/UserRemoveAllRepos";
import DockerFileCreator from "./pages/DockerFileCreator";

function App() {
  return (
    <GlobalContextProvider>
      <BrowserRouter basename="/repo-collab-auto">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/bulkrepocreator" element={<BulkRepoCreator />} />
            <Route path="/bulkcollaboratoradd" element={<BulkCollaboratorAdd />} />
            <Route path="/userremoveallrepos" element={<UserRemoveAllRepos />} />
            <Route path="/dockerfilecreator" element={<DockerFileCreator />} />
            <Route path="*" element={<NoPAT />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalContextProvider>
  );
}

export default App;
