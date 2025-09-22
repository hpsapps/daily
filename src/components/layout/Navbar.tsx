import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between">
        <NavLink to="/" className="text-white text-lg font-bold hover:text-white">
          Daily Changes
        </NavLink>
        <div className="space-x-4">
          <NavLink to="/rff-payback" className="text-gray-300 hover:text-white">RFF Payback</NavLink>
          <NavLink to="/settings" className="text-gray-300 hover:text-white">Settings</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
