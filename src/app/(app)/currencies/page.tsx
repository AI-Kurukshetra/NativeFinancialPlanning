import { CurrencyConsole } from "@/components/app/currency-console";
import { AppTopbar } from "@/components/shell/app-topbar";
import { getCurrenciesPageData } from "@/lib/server/app-data";

export default async function CurrenciesPage() {
  const data = await getCurrenciesPageData();

  return (
    <div className="space-y-6">
      <AppTopbar
        title="Currencies"
        subtitle="Workspace base currency, FX setup, and reporting context"
      />
      <CurrencyConsole data={data} />
    </div>
  );
}
