import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-1 text-xs md:text-sm text-gray-500 font-medium">
      <ol className="flex items-center space-x-2 flex-wrap">
        <li>
          <Link to="/" className="hover:text-[#662654] transition-colors flex items-center gap-1">
            <Home size={14} />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center space-x-2">
              <ChevronRight size={12} className="text-gray-400" />
              {isLast || !item.url ? (
                <span className="text-[#662654] font-semibold truncate max-w-[200px]" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link to={item.url} className="hover:text-[#662654] transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
