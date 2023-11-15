import { MaintenanceData } from "../../routes/types";
import { Checkbox, Table } from "flowbite-react";

type Props = {
  reports: MaintenanceData[];
};

export default function VReportItem({ reports }: Props) {
  return (
    <Table.Body className="divide-y">
      {reports.map((report) => (
        <Table.Row
          key={report.id}
          className="bg-white dark:border-gray-700 dark:bg-[#1d232a]"
        >
          <Table.Cell className="p-4">
            <Checkbox />
          </Table.Cell>
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-[#9ca3af]">
            {report.vehicle}
          </Table.Cell>
          <Table.Cell>{report.maintenance_date}</Table.Cell>
          <Table.Cell>{report.garage}</Table.Cell>
          <Table.Cell>
            $
            {report.service.reduce(
              (total, service) => total + service.price,
              0
            )}
          </Table.Cell>
          <Table.Cell>
            <a
              href="#"
              className="font-medium text-cyan-600 hover:underline dark:text-[#bfedff]"
            >
              Edit
            </a>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  );
}
