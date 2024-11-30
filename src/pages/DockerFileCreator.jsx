import { useCallback, useContext, useState } from "react";
import { GlobalContext } from "../GlobalContext";
import NoPAT from "../components/NoPAT";

const skeleton = `# syntax=docker/dockerfile:1
FROM node:20-alpine
RUN apk add --no-cache git openssh-client
RUN git config --global user.name ["user_name"]
RUN git config --global user.email ["user_email"]
RUN git config --global credential.helper 'cache --timeout=3600' && echo "https://["user_name"]:["pat_token"]@github.com" > ~/.git-credentials
WORKDIR /app
RUN git clone --recurse-submodules https://["user_name"]:["pat_token"]@github.com/["user_name"]/["repo_name"].git .
RUN npm install
CMD ["npm", "start"]
EXPOSE 8000
`;

function DockerFileCreator() {
  const { showAlert } = useContext(GlobalContext);

  const [dockerfile, setDockerfile] = useState("");

  const onStartTask = useCallback(
    (e) => {
      e.preventDefault();

      const {
        user_name = "",
        user_email = "",
        repo_name = "",
        pat_token = "",
      } = Object.fromEntries(new FormData(e.target).entries());

      setDockerfile(
        skeleton
          .replaceAll('["user_name"]', user_name)
          .replaceAll('["user_email"]', user_email)
          .replaceAll('["repo_name"]', repo_name)
          .replaceAll('["pat_token"]', pat_token)
      );

      showAlert({ type: "success", title: "Success !", text: "Docketfile Generated Succesfully" });

      e.target.reset();
    },
    [showAlert]
  );

  return (
    <>
      <form className="form" onSubmit={onStartTask}>
        <label>
          User Name: <input name="user_name" type="text" defaultValue="dreamsinternational" required />
        </label>
        <br />
        <br />
        <label>
          User Email: <input name="user_email" type="email" defaultValue="info@punedreams.com" required />
        </label>
        <br />
        <br />
        <label>
          Repo Name: <input name="repo_name" type="text" defaultValue="" required />
        </label>
        <br />
        <br />
        <label>
          PAT Token: <input name="pat_token" type="text" defaultValue="" required />
        </label>
        <br />
        <br />
        <button type="submit">Generate</button>
      </form>
      {!dockerfile ? (
        <NoPAT />
      ) : (
        <aside>
          <h3>
            <u>Dockerfile</u>
          </h3>
          <pre>{dockerfile}</pre>
        </aside>
      )}
    </>
  );
}

export default DockerFileCreator;
