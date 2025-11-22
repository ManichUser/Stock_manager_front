'use client';
interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
}

export default function Pagination({ page, totalPages, setPage }: PaginationProps) {
  return (
    <div className="flex justify-center gap-2 mt-4">
      <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
        Précédent
      </button>
      <span className="px-3 py-1">{page} / {totalPages}</span>
      <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
        Suivant
      </button>
    </div>
  );
}
