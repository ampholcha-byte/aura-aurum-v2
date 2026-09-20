export type DcaFrequency = "daily" | "weekly" | "monthly";
export type DcaSession = "DAY" | "NIGHT";
export type DcaChannel = "cash" | "ats";

export type GoldPlan = {
  id: string;
  amountTHB: number;
  frequency: DcaFrequency;
  session: DcaSession;
  channel: DcaChannel;
  active: boolean;
};
