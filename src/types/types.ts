export type Service = {
  name: string;
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

export type MaintenancePost = {
  vehicle: string;
  maintenance_date: string;
  current_odo: string;
  next_odo: string;
  garage: string;
  service?: Service[];
};

export type SavedMaintenance = {
  id: number;
};

export type MaintenanceID = number;
export type deletedMaintenance = {};
