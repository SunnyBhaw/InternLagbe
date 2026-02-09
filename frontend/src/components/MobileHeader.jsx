import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import banner from '../assets/Banner1.png';

const MobileHeader = ({ isOpen, setIsOpen, role }) => {
  const homePath = role === 'admin' ? '/admin' : role === 'company' ? '/company' : '/student';

  return (
    <div className="lg:hidden h-20 bg-primary flex items-center justify-between px-6 sticky top-0 z-50 border-b border-primary-light/20">
      <Link to={homePath} className="flex items-center">
        <img src={banner} alt="InternLagbe" className="h-8 w-auto object-contain" />
      </Link>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-text-inverse hover:bg-primary-light/20 rounded-xl transition-colors"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
    </div>
  );
};

export default MobileHeader;
