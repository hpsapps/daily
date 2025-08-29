import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <div className="text-white text-lg font-bold">
          Daily Changes
        </div>
        <div className="space-x-4">
          <NavLink to="/" className="text-gray-300 hover:text-white">Absence Management</NavLink>
          <NavLink to="/setup" className="text-gray-300 hover:text-white">Setup</NavLink>
          <NavLink to="/rff-payback" className="text-gray-300 hover:text-white">RFF Payback</NavLink>
          <NavLink to="/settings" className="text-gray-300 hover:text-white">Settings</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
