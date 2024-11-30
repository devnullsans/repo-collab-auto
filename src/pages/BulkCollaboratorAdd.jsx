import { useCallback, useContext, useState } from "react";
import { GlobalContext } from "../GlobalContext";
import { Octokit } from "@octokit/rest";
import Csvs from "../components/Csvs";
import NoPAT from "../components/NoPAT";

function BulkCollaboratorAdd() {
  const { showAlert, setLoading } = useContext(GlobalContext);

  const [pat, setPat] = useState("");
  const [octokit, setOctokit] = useState(null);
  const [repoText, setRepoText] = useState("");
  const [collabText, setCollabText] = useState("");
  const [messages, setMessages] = useState([]);

  const onStartTask = useCallback(
    async (e) => {
      e.preventDefault();
      if (!octokit || !repoText.length || !collabText.length) return;
      setLoading(true);
      setMessages([]);
      try {
        const repoNames = repoText.split(",").map((t) => t.trim());
        const collaboratorNames = collabText.split(",").map((t) => t.trim());

        const { data: user } = await octokit.rest.users.getAuthenticated();
        const ownerusername = user.login;

        for (const repoName of repoNames) {
          for (const collaboratorName of collaboratorNames) {
            try {
              await octokit.repos.addCollaborator({
                owner: ownerusername,
                repo: repoName,
                username: collaboratorName,
                permission: "push", // ['admin', 'push', 'pull']
              });

              setMessages((ms) => ms.concat(`Added ${collaboratorName} as Collaborator in ${repoName}`));
            } catch (error) {
              console.log(error);
              showAlert({ type: "error", title: "Error !", text: error.message });
              setMessages((ms) => ms.concat(`Failed to add ${collaboratorName} as Collaborator in ${repoName}`));
            }
          }
        }

        setRepoText("");
        setCollabText("");
        setMessages((ms) => ms.concat("All Possible Collaborators added"));

        showAlert({ type: "success", title: "Success !", text: "All Possible Collaborators added to Repositories" });
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
              <u>Logs</u>
            </h3>
            {messages.map((m) => (
              <p key={m}>{m}</p>
            ))}
          </aside>
        </>
      )}
    </>
  );
}

export default BulkCollaboratorAdd;
