import { Link } from 'react-router-dom';
import { FiLayout, FiChevronRight } from 'react-icons/fi';

const PagesList = () => {
  const pages = [
    {
      id: 'landing-page',
      name: 'Landing Page',
      description: 'Manage the Home / Landing page content, including hero banner, community section, and FAQs.',
      status: 'Published'
    }
    // Future pages like 'About Us', 'Contact' can go here
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-playfair">Pages</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Page Name</th>
                <th scope="col" className="px-6 py-4 font-semibold">Description</th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-cream/30 flex items-center justify-center text-brand-plum">
                        <FiLayout size={18} />
                      </div>
                      <span className="font-semibold text-gray-900 text-base">{page.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-md">
                    {page.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-200">
                      {page.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to={`/pages/${page.id}`}
                      className="inline-flex items-center gap-1 bg-brand-plum/10 text-brand-plum hover:bg-brand-plum hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Edit Page <FiChevronRight />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PagesList;
