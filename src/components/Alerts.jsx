import { useCallback, useState } from "react";

export function useAlert() {
  const [list, setList] = useState([]);

  const addAlert = useCallback(
    (alert) => {
      const id = setTimeout(() => delAlert(), 6e3);
      const delAlert = () => {
        clearTimeout(id);
        setList((l) => l.filter((a) => a.id !== id));
      };
      setList((l) => l.concat({ id, delAlert, ...alert }));
    },
    [setList]
  );

  return [list, addAlert];
}

function Alert({ type, title, text, delAlert }) {
  return (
    <div className={`alert alert-${type}`} role="alert" onClick={delAlert}>
      <h4 className="alert-title">{title}</h4>
      <div className="text-muted">{text}</div>
    </div>
  );
}

export default function AlertContainer({ alerts }) {
  return (
    <div className="alerts">
      <div className="alert-container">
        {alerts.map((alert) => (
          <Alert key={alert.id} {...alert} />
        ))}
      </div>
    </div>
  );
}
