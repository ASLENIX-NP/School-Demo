import AdminLayout, { PageCard } from "./AdminLayout";
const classes = [
  ["Nursery", "A & B", "56", "Mrs. Laxmi"],
  ["Grade 5", "A & B", "82", "Mr. Sagar"],
  ["Grade 8", "A & B", "78", "Ms. Nisha"],
  ["Grade 10", "A", "43", "Mrs. Anita"],
];
export default function Classes() {
  return (
    <AdminLayout
      title="Classes"
      subtitle="Classrooms, sections and class teachers."
    >
      <PageCard>
        <div className="section-head">
          <h2>Academic classes</h2>
          <button className="button">+ Create class</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Sections</th>
              <th>Students</th>
              <th>Class teacher</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c[0]}>
                {c.map((x, i) => (
                  <td key={x}>{i === 0 ? <b>{x}</b> : x}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </PageCard>
    </AdminLayout>
  );
}
