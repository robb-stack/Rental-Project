import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">CarRental Admin</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem to="/users" label="Users" />
          <NavItem to="/vehicles" label="Vehicles" />
          <NavItem to="/bookings" label="Bookings" />
          <NavItem to="/documents" label="Document Review" />
        </nav>

        <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-500">
          © 2026 CarRental
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

const NavItem = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-2 rounded-md font-medium transition-all ${
          isActive
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
        }`
      }
    >
      {label}
    </NavLink>
  );
};

export default Layout;
