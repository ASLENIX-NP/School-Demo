import React from "react";
import { departmentsList } from "../data/staffData";

export function DepartmentFilter({ activeDepartment, setActiveDepartment }) {
  return (
    <div className="flex flex-wrap items-center justify-start gap-2 max-w-4xl">
      {departmentsList.map((dept) => {
        const isActive = activeDepartment === dept;
        return (
          <button
            key={dept}
            onClick={() => setActiveDepartment(dept)}
            aria-label={`Filter staff by ${dept} department`}
            aria-pressed={isActive}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-[#0A1628] text-white shadow-md border border-[#0A1628]"
                : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {dept}
          </button>
        );
      })}
    </div>
  );
}

export default DepartmentFilter;
