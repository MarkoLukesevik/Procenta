export default interface StatisticsResponse {
  totalDiscounts: number;
  lokals: statisticsLokal[];
}

export interface statisticsLokal {
  name: string;
  totalDiscounts: number;
  employees: statisticsLokalEmployees[];
}

export interface statisticsLokalEmployees {
  discountsGiven: number;
  imageUrl: string;
  name: string;
}
