"use client";

import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CurrenciesPageData } from "@/lib/server/app-data";

type CurrencyConsoleProps = {
  data: CurrenciesPageData;
};

export function CurrencyConsole({ data }: CurrencyConsoleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currencyCode, setCurrencyCode] = useState("");
  const [currencyName, setCurrencyName] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [currencyIsBase, setCurrencyIsBase] = useState(false);
  const [baseCurrencyId, setBaseCurrencyId] = useState(data.currencies.find((item) => item.isBase)?.id ?? "");
  const [quoteCurrencyId, setQuoteCurrencyId] = useState("");
  const [rate, setRate] = useState("");
  const [source, setSource] = useState("manual");

  function createCurrency(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch("/api/currencies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind: "currency",
          code: currencyCode,
          name: currencyName,
          symbol: currencySymbol,
          isBase: currencyIsBase,
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Failed to create currency.");
        return;
      }

      toast.success("Currency created.");
      setCurrencyCode("");
      setCurrencyName("");
      setCurrencySymbol("");
      setCurrencyIsBase(false);
      router.refresh();
    });
  }

  function createExchangeRate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch("/api/currencies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind: "exchangeRate",
          baseCurrencyId,
          quoteCurrencyId,
          rate: Number(rate),
          source,
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Failed to create exchange rate.");
        return;
      }

      toast.success("Exchange rate created.");
      setQuoteCurrencyId("");
      setRate("");
      setSource("manual");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <Card>
          <CardHeader>
            <CardTitle>Currency setup</CardTitle>
            <CardDescription>
              Maintain the reporting currency foundation for the workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={createCurrency}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800" htmlFor="currency-code">
                    Currency code
                  </label>
                  <Input
                    id="currency-code"
                    onChange={(event) => setCurrencyCode(event.target.value.toUpperCase())}
                    placeholder="USD"
                    value={currencyCode}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800" htmlFor="currency-symbol">
                    Symbol
                  </label>
                  <Input
                    id="currency-symbol"
                    onChange={(event) => setCurrencySymbol(event.target.value)}
                    placeholder="$"
                    value={currencySymbol}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800" htmlFor="currency-name">
                  Currency name
                </label>
                <Input
                  id="currency-name"
                  onChange={(event) => setCurrencyName(event.target.value)}
                  placeholder="US Dollar"
                  value={currencyName}
                />
              </div>

              <label className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-700">
                <input
                  checked={currencyIsBase}
                  className="size-4 rounded border border-slate-300"
                  onChange={(event) => setCurrencyIsBase(event.target.checked)}
                  type="checkbox"
                />
                Mark as workspace base currency
              </label>

              <Button className="w-full" leftIcon={<PlusCircle className="size-4" />} loading={isPending} type="submit">
                Add currency
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workspace currency map</CardTitle>
            <CardDescription>
              Review active currencies and the reporting base for the current workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {data.currencies.length === 0 ? (
              <p className="text-sm text-slate-500">No currencies configured yet.</p>
            ) : (
              data.currencies.map((currency) => (
                <div className="rounded-[24px] bg-white/75 p-4" key={currency.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">
                        {currency.code} · {currency.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Symbol {currency.symbol || "N/A"} · {currency.decimalPlaces} decimals
                      </p>
                    </div>
                    {currency.isBase ? <Badge variant="success">Base</Badge> : null}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <Card>
          <CardHeader>
            <CardTitle>Add exchange rate</CardTitle>
            <CardDescription>
              Create manual FX rates for testing reporting and international models.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={createExchangeRate}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800" htmlFor="base-currency">
                  Base currency
                </label>
                <select
                  className="flex h-11 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-2 text-sm text-slate-950 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  id="base-currency"
                  onChange={(event) => setBaseCurrencyId(event.target.value)}
                  value={baseCurrencyId}
                >
                  <option value="">Select base currency</option>
                  {data.currencies.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800" htmlFor="quote-currency">
                  Quote currency
                </label>
                <select
                  className="flex h-11 w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-2 text-sm text-slate-950 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  id="quote-currency"
                  onChange={(event) => setQuoteCurrencyId(event.target.value)}
                  value={quoteCurrencyId}
                >
                  <option value="">Select quote currency</option>
                  {data.currencies
                    .filter((currency) => currency.id !== baseCurrencyId)
                    .map((currency) => (
                      <option key={currency.id} value={currency.id}>
                        {currency.code}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800" htmlFor="fx-rate">
                    Rate
                  </label>
                  <Input
                    id="fx-rate"
                    min="0"
                    onChange={(event) => setRate(event.target.value)}
                    placeholder="83.12"
                    step="0.0001"
                    type="number"
                    value={rate}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800" htmlFor="fx-source">
                    Source
                  </label>
                  <Input
                    id="fx-source"
                    onChange={(event) => setSource(event.target.value)}
                    placeholder="manual"
                    value={source}
                  />
                </div>
              </div>

              <Button className="w-full" loading={isPending} type="submit" variant="secondary">
                Add exchange rate
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exchange rate ladder</CardTitle>
            <CardDescription>
              Current FX context driving multi-region reporting visuals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.exchangeRates.length === 0 ? (
              <p className="text-sm text-slate-500">No exchange rates captured yet.</p>
            ) : (
              data.exchangeRates.map((exchangeRate) => (
                <div className="rounded-[24px] bg-white/75 p-4" key={exchangeRate.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">
                        {exchangeRate.baseCurrencyCode}/{exchangeRate.quoteCurrencyCode}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {exchangeRate.source} ·{" "}
                        {new Date(exchangeRate.effectiveAt).toLocaleString("en-US")}
                      </p>
                    </div>
                    <Badge variant="secondary">{exchangeRate.rate.toFixed(4)}</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
