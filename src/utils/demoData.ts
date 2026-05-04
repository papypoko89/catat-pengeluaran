import { Expense } from "../types";

export function buildDemoExpenses(month: string): Expense[] {
  const demoItems = [
    ["03", 82000, "Makanan", "Sarapan dan kopi"],
    ["04", 175000, "Transportasi", "Bensin motor"],
    ["07", 320000, "Belanja", "Kebutuhan bulanan"],
    ["09", 650000, "Tagihan", "Internet dan listrik"],
    ["11", 58000, "Makanan", "Makan siang"],
    ["13", 125000, "Kesehatan", "Vitamin"],
    ["16", 210000, "Hiburan", "Nonton akhir pekan"],
    ["18", 95000, "Transportasi", "Ojek online"],
    ["21", 275000, "Pendidikan", "Buku dan kursus"],
    ["23", 115000, "Makanan", "Dinner keluarga"],
    ["25", 148000, "Lainnya", "Hadiah kecil"],
    ["28", 420000, "Belanja", "Perlengkapan rumah"],
  ] as const;

  return demoItems.map(([day, amount, category, note], index) => ({
    id: `demo-${month}-${index}-${crypto.randomUUID()}`,
    date: `${month}-${day}`,
    amount,
    category,
    note,
  }));
}

const threeMonthDemoItems: Record<string, Array<[string, number, string, string]>> = {
  "2026-03": [
    ["02", 45000, "Makanan", "Kopi pagi dan roti"],
    ["03", 120000, "Transportasi", "Bensin motor"],
    ["05", 280000, "Belanja", "Belanja dapur mingguan"],
    ["07", 650000, "Tagihan", "Internet dan listrik"],
    ["10", 38000, "Makanan", "Bakso sore"],
    ["12", 95000, "Kesehatan", "Vitamin dan obat flu"],
    ["15", 185000, "Hiburan", "Nonton bioskop"],
    ["17", 75000, "Transportasi", "Parkir dan tol"],
    ["20", 240000, "Pendidikan", "Buku kerja"],
    ["22", 132000, "Belanja", "Shopee kabel dan charger"],
    ["25", 56000, "Makanan", "Makan siang ayam"],
    ["28", 110000, "Lainnya", "Hadiah kecil"],
  ],
  "2026-04": [
    ["01", 58000, "Makanan", "Kopi dan sarapan"],
    ["03", 165000, "Transportasi", "Bensin full tank"],
    ["04", 320000, "Belanja", "Tokopedia perlengkapan rumah"],
    ["06", 720000, "Tagihan", "PLN dan internet"],
    ["08", 42000, "Makanan", "Mie ayam"],
    ["11", 135000, "Kesehatan", "Apotek dan vitamin"],
    ["13", 99000, "Transportasi", "Gojek meeting"],
    ["16", 225000, "Hiburan", "Netflix dan nonton"],
    ["18", 310000, "Pendidikan", "Kursus online"],
    ["20", 176000, "Belanja", "Ace hardware"],
    ["24", 72000, "Makanan", "KFC makan siang"],
    ["27", 145000, "Lainnya", "Servis kecil"],
  ],
  "2026-05": [
    ["01", 35000, "Makanan", "Kopi kenangan"],
    ["02", 75000, "Transportasi", "Bensin"],
    ["03", 25900, "Makanan", "KFC snack"],
    ["04", 120000, "Tagihan", "Token listrik"],
    ["04", 27000, "Makanan", "Kopi manis"],
    ["04", 5000, "Makanan", "Gorengan tahu"],
    ["06", 210000, "Belanja", "Shopee kabel"],
    ["08", 150000, "Kesehatan", "Vitamin"],
    ["10", 98000, "Transportasi", "Parkir mall dan tol"],
    ["12", 180000, "Hiburan", "Spotify dan game"],
    ["15", 275000, "Pendidikan", "Buku dan kelas"],
    ["18", 1250000, "Tagihan", "Sewa"],
  ],
};

export const demoMonths = Object.keys(threeMonthDemoItems);

export const demoBudgets: Record<string, number> = {
  "2026-03": 3_200_000,
  "2026-04": 3_500_000,
  "2026-05": 3_800_000,
};

export function buildThreeMonthDemoExpenses(): Expense[] {
  return Object.entries(threeMonthDemoItems).flatMap(([month, items]) =>
    items.map(([day, amount, category, note], index) => ({
      id: `demo-${month}-${index}-${crypto.randomUUID()}`,
      date: `${month}-${day}`,
      amount,
      category,
      note,
    })),
  );
}
