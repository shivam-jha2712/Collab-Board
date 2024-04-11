import { Sidebar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar";
import { OrgSidebar } from "./_components/org-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="h-full">
      <Sidebar />
      <div className="pl-[60px] h-full">
        <div className="flex gap-x-3 h-full">
          <OrgSidebar />
          <div className="h-full flex-1">
            {/* Add NavBar */}
            <Navbar />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;

/*
This code defines a React component called `DashboardLayout`. Let's break down each part:

1. `interface DashboardLayoutProps`: This declares an interface named `DashboardLayoutProps`. Interfaces in TypeScript are used to define the shape of objects. In this case, it specifies that the `DashboardLayout` component expects a prop called `children` which should be of type `React.ReactNode`. `React.ReactNode` is a type provided by React which represents the type of children elements that a React component can render.

2. `const DashboardLayout = ({ children }: DashboardLayoutProps) => {...}`: This defines a functional component named `DashboardLayout`. It takes an object as its argument using object destructuring to extract the `children` prop from the props object. The `children` prop is of the type defined in the `DashboardLayoutProps` interface.

3. `return <div>{children}</div>;`: Inside the component, it returns a `div` element that renders whatever content is passed as `children`. In React, the `children` prop represents the content that is nested inside the component when it's used. By wrapping `children` inside a `div`, this component serves as a layout component that can wrap other components and add common layout styling or structure.

4. `export default DashboardLayout;`: This exports the `DashboardLayout` component as the default export, allowing it to be imported and used in other parts of the application. When a component is exported as default, it can be imported without curly braces. For example: `import DashboardLayout from './DashboardLayout';`.

Overall, this code defines a reusable layout component `DashboardLayout` that can be used to wrap other components and provide consistent layout structure within a React application.

*/
