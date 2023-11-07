export type Service = {
  service_name: string;
  description: string;
  price: number;
};

export type MaintenanceData = {
  id: number;
  vehicle: string;
  maintenance_date: string;
  current_odo: string;
  next_odo: string;
  garage: string;
  service: Service[];
};
