import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <nav className="nav">
        <NavLink to="/bulkrepocreator">Bulk Repo Creator</NavLink>
        <NavLink to="/bulkcollaboratoradd">Bulk Collaborator Add</NavLink>
        <NavLink to="/userremoveallrepos">User Remove All Repos</NavLink>
        <NavLink to="/dockerfilecreator">Docker File Creator</NavLink>
      </nav>
      <Outlet />
    </>
  );
}
