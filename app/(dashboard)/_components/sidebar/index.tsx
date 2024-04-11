import { List } from "./list";
import { NewButton } from "./new-button";

export const Sidebar = () => {
  return (
    <aside className="fixed z-[1] left-0 bg-slate-900 h-full w-[60px] flex p-3 flex-col gap-y-4 text-white">
      {/*bg-blue-950  bg-black bg-opacity-95*/}
      <List /> {/*List of Orgs created */}
      <NewButton /> {/*Button to create Orgs */}
    </aside>
  );
};
