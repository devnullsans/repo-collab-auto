import { useCallback, useContext, useState } from "react";
import { GlobalContext } from "../GlobalContext";
import { Octokit } from "@octokit/rest";
import Names from "../components/Names";
import NoPAT from "../components/NoPAT";

function UserRemoveAllRepos() {
  const { showAlert, setLoading } = useContext(GlobalContext);

  const [pat, setPat] = useState("");
  const [octokit, setOctokit] = useState(null);
  const [collaboratorNames, setCollaboratorNames] = useState([""]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const onStartTask = useCallback(
    async (e) => {
      e.preventDefault();
      if (!octokit || !collaboratorNames.length) return;
      setLoading(true);
      try {
        const { data: user } = await octokit.rest.users.getAuthenticated();
        const ownerusername = user.login;

        const repositories = [];
        let page = 1,
          len = 0;
        do {
          try {
            const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({ per_page: 100, page });
            page++;
            len = repos.length;

            repositories.push(...repos.filter((re) => re.owner.login === ownerusername));
          } catch (error) {
            console.log(error);
            showAlert({ type: "error", title: "Error !", text: error.message });
          }
        } while (len > 0);

        for (const repo of repositories) {
          try {
            const { data: collaborators } = await octokit.rest.repos.listCollaborators({
              owner: repo.owner.login,
              repo: repo.name,
            });
            setMessage(`Checking ${repo.name}`);
            for (const cname of collaboratorNames) {
              const collaborator = collaborators.find((c) => c.login === cname);

              if (collaborator) {
                try {
                  await octokit.rest.repos.removeCollaborator({
                    owner: repo.owner.login,
                    repo: repo.name,
                    username: cname,
                  });
                  setMessages((ms) => [`Removed ${cname} from ${repo.name}`, ...ms]);
                } catch (error) {
                  console.log(error);
                  showAlert({ type: "error", title: "Error !", text: error.message });
                }
              }
            }
          } catch (error) {
            console.log(error);
            showAlert({ type: "error", title: "Error !", text: error.message });
          }
        }
        setMessage(`All Repos Checked !`);
        setCollaboratorNames([""]);
        showAlert({ type: "success", title: "Success !", text: "Collaborators Removed from All Repositories" });
      } catch (error) {
        console.log(error);
        showAlert({ type: "error", title: "Error !", text: error.message });
      } finally {
        setLoading(false);
      }
    },
    [octokit, collaboratorNames, setLoading, showAlert]
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
            <Names title="collaborator" names={collaboratorNames} setNames={setCollaboratorNames} />
            <aside>
              <button type="submit">Remove</button>
            </aside>
          </form>
          <aside>
            <h3>
              <u>Logs</u>
            </h3>
            {messages.map((r) => (
              <p key={r}>{r}</p>
            ))}
            <p>{message}</p>
          </aside>
        </>
      )}
    </>
  );
}

export default UserRemoveAllRepos;
