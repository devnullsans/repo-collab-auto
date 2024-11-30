import { useCallback, useContext, useState } from "react";
import { GlobalContext } from "../GlobalContext";
import { Octokit } from "@octokit/rest";
import Csvs from "../components/Csvs";
import NoPAT from "../components/NoPAT";

function BulkRepoCreator() {
  const { showAlert, setLoading } = useContext(GlobalContext);

  const [pat, setPat] = useState("");
  const [octokit, setOctokit] = useState(null);
  const [repoText, setRepoText] = useState("");
  const [collabText, setCollabText] = useState("");
  const [repositories, setRepositories] = useState([]);

  const onStartTask = useCallback(
    async (e) => {
      e.preventDefault();
      if (!octokit || !repoText.length) return;
      setLoading(true);
      try {
        const repoNames = repoText.split(",").map((t) => t.trim());
        const collaboratorNames = collabText.split(",").map((t) => t.trim());

        for (const repoName of repoNames) {
          try {
            const { data: repo } = await octokit.repos.createForAuthenticatedUser({
              name: repoName,
              // auto_init: false,
              private: true,
            });

            repo.collaborators = [];

            for (const collaboratorName of collaboratorNames) {
              try {
                const { data: req } = await octokit.repos.addCollaborator({
                  owner: repo.owner.login,
                  repo: repo.name,
                  username: collaboratorName,
                  permission: "push", // ['admin', 'push', 'pull']
                });

                repo.collaborators.push(req);
              } catch (error) {
                console.log(error);
                showAlert({ type: "error", title: "Error !", text: error.message });
              }
            }

            setRepositories((r) => r.concat(repo));
          } catch (error) {
            console.log(error);
            showAlert({ type: "error", title: "Error !", text: error.message });
          }
        }
        setRepoText("");
        setCollabText("");
        showAlert({ type: "success", title: "Success !", text: "Collaborators added to Repositories" });
      } catch (error) {
        console.log(error);
        showAlert({ type: "error", title: "Error !", text: error.message });
      } finally {
        setLoading(false);
      }
    },
    [collabText, octokit, repoText, setLoading, showAlert]
  );

  return (
    <>
      <header className="header">
        <label htmlFor="pat">PAT Token:</label>
        <input id="pat" type="text" value={pat} onChange={(e) => setPat(e.target.value)} />
        <button onClick={() => setOctokit(new Octokit({ auth: pat })) ?? setPat("")}>Init</button>
      </header>
      {!octokit ? (
        <NoPAT />
      ) : (
        <>
          <form className="form" onSubmit={onStartTask}>
            <Csvs title="repository" text={repoText} setText={setRepoText} />
            <Csvs title="collaborator" text={collabText} setText={setCollabText} />
            <aside>
              <button type="submit">Start</button>
            </aside>
          </form>
          <aside>
            <h3>
              <u>Repositories</u>
            </h3>
            {repositories.map((r) => (
              <details key={r.id}>
                <summary>{r.full_name}</summary>
                <hr />
                <pre>{JSON.stringify(r, 0, 1)}</pre>
              </details>
            ))}
          </aside>
        </>
      )}
    </>
  );
}

export default BulkRepoCreator;
