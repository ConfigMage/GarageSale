import {
  Banknote,
  CalendarDays,
  Car,
  Clock,
  MapPin,
  PackageCheck,
  CloudRain,
} from "lucide-react";

type SaleInfoProps = {
  info: {
    date: string;
    time: string;
    area: string;
    paymentMethods: string;
    parking: string;
    largeItemPickup: string;
    rainPlan: string;
  };
};

export function SaleInfo({ info }: SaleInfoProps) {
  const rows = [
    ["Date", info.date, CalendarDays],
    ["Time", info.time, Clock],
    ["Address / general area", info.area, MapPin],
    ["Payment methods", info.paymentMethods, Banknote],
    ["Parking", info.parking, Car],
    ["Large item pickup", info.largeItemPickup, PackageCheck],
    ["Rain plan", info.rainPlan, CloudRain],
  ] as const;

  return (
    <section id="sale-info" className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-wide text-broadcast-red">
            Operators are consulting clipboards
          </p>
          <h2 className="font-display text-4xl font-black text-broadcast-ink sm:text-5xl">
            Sale Info
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rows.map(([label, value, Icon]) => (
            <div
              key={label}
              className="rounded-lg border-2 border-broadcast-ink bg-broadcast-cream p-5"
            >
              <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-broadcast-blue">
                <Icon aria-hidden="true" size={18} />
                {label}
              </div>
              <p className="text-lg font-bold leading-7 text-broadcast-ink">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
