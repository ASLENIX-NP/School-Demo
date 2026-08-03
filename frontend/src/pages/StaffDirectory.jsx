import React, { useState, useMemo } from "react";
import { Sparkles, Users } from "lucide-react";
import { staffData } from "../data/staffData";
import SearchBar from "../components/SearchBar";
import DepartmentFilter from "../components/DepartmentFilter";
import StaffCard from "../components/StaffCard";

export function StaffDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("All");

  const filteredStaff = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return staffData.filter((teacher) => {
      const matchesDept =
        activeDepartment === "All" || teacher.department === activeDepartment;

      if (!matchesDept) return false;

      if (!query) return true;

      const haystack = `${teacher.name} ${teacher.subject} ${teacher.department} ${teacher.title}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [searchTerm, activeDepartment]);

  return (
    <section className="min-h-screen pt-28 pb-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
        <header className="text-left max-w-3xl mb-8">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#0A1628] text-white shadow-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Faculty & Team
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0A1628] tracking-tight leading-tight">
            Our Faculty & Staff
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Meet our experienced teachers and administrative staff.
          </p>
        </header>

        {/* Search Bar & Department Filter Controls */}
        <div className="space-y-6 mb-12">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <DepartmentFilter
            activeDepartment={activeDepartment}
            setActiveDepartment={setActiveDepartment}
          />
        </div>

        {/* Staff Grid Container */}
        {filteredStaff.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {filteredStaff.map((teacher) => (
              <StaffCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-slate-200/90 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0A1628]">No Faculty Found</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              No staff members match your current search or filter criteria. Try adjusting your keywords or selected department.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveDepartment("All");
              }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#0A1628] text-white text-xs font-bold hover:bg-blue-900 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default StaffDirectory;
