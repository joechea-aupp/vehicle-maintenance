import { Pagination } from "flowbite-react";
type Props = {
  totalPages: number;
  onChange: (page: number) => void;
  currentPage: number;
};
export default function PaginationCustom({
  totalPages,
  onChange,
  currentPage,
}: Props) {
  const getTotalPage = (totalRows: number, displayPerPage: number) => {
    const result = totalRows % displayPerPage;
    if (result === 0) {
      return Math.floor(totalRows / displayPerPage);
    } else {
      return Math.floor(totalRows / displayPerPage) + 1;
    }
  };
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={getTotalPage(totalPages, 5)}
      onPageChange={(e) => onChange(e)}
      showIcons
      className="pagination-sm"
      //   layout="table"
    />
  );
}
