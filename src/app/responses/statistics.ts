export default interface StatisticsResponse {
  totalDiscounts: number;
  lokals: StatisticsLokal[];
  statistics: StatisticsPerDay[];
}

export interface StatisticsLokal {
  name: string;
  totalDiscounts: number;
  employees: StatisticsLokalEmployees[];
}

export interface StatisticsLokalEmployees {
  discountsGiven: number;
  imageUrl: string;
  name: string;
}

export interface StatisticsPerDay {
  day: string;
  qrScans: QrScan[];
}

export interface QrScan {
  lokalId: string;
}
