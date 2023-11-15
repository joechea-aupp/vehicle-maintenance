import { Table } from "flowbite-react";

export default function SkeletonRow() {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <Table.Body key={index} className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-[#1d232a]">
            <Table.Cell className="pl-4">
              <div className="skeleton w-5 h-4"></div>
            </Table.Cell>
            <Table.Cell>
              <div className="skeleton w-28 h-4"></div>
            </Table.Cell>
            <Table.Cell>
              <div className="skeleton w-28 h-4"></div>
            </Table.Cell>
            <Table.Cell>
              <div className="skeleton w-28 h-4"></div>
            </Table.Cell>
            <Table.Cell>
              <div className="skeleton w-25 h-4"></div>
            </Table.Cell>
            <Table.Cell>
              <div className="skeleton w-20 h-4"></div>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      ))}
    </>
  );
}
