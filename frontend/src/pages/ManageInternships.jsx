import {
    AlertCircle,
    Briefcase,
    Edit,
    Filter,
    Loader2,
    PlusCircle,
    Search,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CompanySidebar from "../components/CompanySidebar";
import MobileHeader from "../components/MobileHeader";
import api from "../utils/api";

const ManageInternships = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userRes, internshipRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/internships/my"),
        ]);
        setUser(userRes.data.data);
        setInternships(internshipRes.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load internships");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this internship posting?")
    ) {
      try {
        await api.delete(`/internships/${id}`);
        setInternships(
          internships.filter((internship) => internship._id !== id),
        );
      } catch (err) {
        alert(err.response?.data?.error || "Failed to delete internship");
      }
    }
  };

  const filteredInternships = internships.filter((internship) => {
    const isExpired = new Date(internship.deadline) <= new Date();
    const dynamicStatus = isExpired ? "closed" : internship.status;
    const matchesSearch = internship.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || dynamicStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-secondary">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-bg-secondary lg:overflow-hidden">
      <CompanySidebar user={user} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} role="company" />

        {/* Header */}
        <header className="hidden lg:flex h-20 bg-bg-primary border-b border-border-light items-center justify-between px-8">
          <div>
            <h2 className="text-2xl font-black text-primary tracking-tight">
              Manage Internships
            </h2>
            <p className="text-sm text-text-tertiary font-medium">
              Overview of your posted opportunities
            </p>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-bg-secondary custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by title..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-border-light rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-primary shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-white border border-border-light rounded-2xl px-3 py-1.5 shadow-sm">
                  <Filter size={16} className="text-text-tertiary mr-2" />
                  <select
                    className="bg-transparent border-none focus:ring-0 font-bold text-sm text-primary appearance-none pr-6 cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <Link
                  to="/company/post"
                  className="px-6 py-3 bg-primary text-text-inverse font-black text-sm rounded-2xl shadow-lg shadow-primary/10 hover:bg-primary-light active:scale-[0.98] transition-all flex items-center space-x-2"
                >
                  <PlusCircle size={18} />
                  <span>New Post</span>
                </Link>
              </div>
            </div>

            {/* Internships List */}
            {error ? (
              <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h3 className="text-xl font-black text-red-600 mb-2">
                  Something went wrong
                </h3>
                <p className="text-red-500/80 font-medium">{error}</p>
              </div>
            ) : filteredInternships.length === 0 ? (
              <div className="bg-white border border-border-light p-20 rounded-[2.5rem] flex flex-col items-center text-center shadow-sm">
                <div className="h-24 w-24 bg-bg-tertiary rounded-[2rem] flex items-center justify-center text-primary/30 mb-8 border border-border-light">
                  <Briefcase size={40} />
                </div>
                <h3 className="text-2xl font-black text-primary mb-2">
                  No internships found
                </h3>
                <p className="text-text-tertiary font-medium text-lg max-w-sm">
                  {searchTerm || statusFilter !== "all"
                    ? "We couldn't find any results matching your filters."
                    : "You haven't posted any internships yet. Start by creating a new opportunity."}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Link
                    to="/company/post"
                    className="mt-8 px-8 py-3.5 bg-secondary text-primary font-black rounded-2xl hover:bg-secondary-dark transition-all"
                  >
                    Create Your First Post
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-white border border-border-light rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-bg-tertiary/30 border-b border-border-light">
                        <th className="px-8 py-6 text-xs font-black text-text-tertiary uppercase tracking-widest">
                          Internship Role
                        </th>
                        <th className="px-8 py-6 text-xs font-black text-text-tertiary uppercase tracking-widest">
                          Category
                        </th>
                        <th className="px-8 py-6 text-xs font-black text-text-tertiary uppercase tracking-widest">
                          Status
                        </th>
                        <th className="px-8 py-6 text-xs font-black text-text-tertiary uppercase tracking-widest text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                      {filteredInternships.map((internship) => (
                        <tr
                          key={internship._id}
                          className="hover:bg-bg-tertiary/10 transition-colors group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-primary text-lg group-hover:text-primary-light transition-colors">
                                {internship.title}
                              </span>
                              <span className="text-sm text-text-tertiary font-medium flex items-center mt-1">
                                {internship.location} • {internship.duration}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="inline-flex items-center px-3 py-1 bg-bg-tertiary rounded-lg text-xs font-bold text-primary border border-border-light">
                              {internship.category}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            {(() => {
                              const isExpired =
                                new Date(internship.deadline) <= new Date();
                              const displayStatus = isExpired
                                ? "closed"
                                : internship.status;
                              const isActive = displayStatus === "active";

                              return (
                                <span
                                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                                    isActive
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                      : "bg-red-50 text-red-600 border-red-200"
                                  }`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
                                  ></span>
                                  <span>{displayStatus}</span>
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() =>
                                  navigate(`/company/edit/${internship._id}`)
                                }
                                className="p-2.5 text-text-tertiary hover:text-primary hover:bg-white rounded-xl border border-transparent hover:border-border-light transition-all shadow-none hover:shadow-sm"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(internship._id)}
                                className="p-2.5 text-text-tertiary hover:text-red-500 hover:bg-white rounded-xl border border-transparent hover:border-border-light transition-all shadow-none hover:shadow-sm"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageInternships;
