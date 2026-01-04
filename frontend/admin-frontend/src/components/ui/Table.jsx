export default function Table({ columns = [], data = [] }) {
  return (
    <div className="overflow-auto bg-[#081826] rounded-lg border border-slate-700">
      <table className="min-w-full divide-y divide-slate-700">
        <thead>
          <tr>
            {columns.map(col => <th key={col.key} className="px-4 py-2 text-left text-sm text-slate-400">{col.title}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="odd:bg-[#07161a]">
              {columns.map(col => <td key={col.key} className="px-4 py-3 text-sm">{col.render ? col.render(row) : row[col.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
