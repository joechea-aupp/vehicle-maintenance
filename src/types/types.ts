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

export type MaintenanceResponse = {
  body: MaintenanceData[];
  headers: Headers;
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

export type MenuData = {
  id: number;
  name: string;
  path: string;
  description: string;
};

export type VehicleData = {
  id: number;
  name: string;
  brand: string;
  color: string;
  year: string;
};

export type GarageData = {
  id: number;
  name: string;
  address: string;
  phone: string;
};

export type TemplateData = {
  id: number;
  name: string;
  description: string;
  service: Service[];
};
