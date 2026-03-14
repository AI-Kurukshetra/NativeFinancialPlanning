import { ZodError } from "zod";
import { NextResponse, type NextRequest } from "next/server";

import { apiError, parseJsonBody, requireApiAccess } from "@/lib/api/route-helpers";
import {
  currencyCreateSchema,
  exchangeRateCreateSchema,
} from "@/lib/schemas/resources";

type CurrencyRow = {
  id: string;
  code: string;
  name: string;
  symbol: string;
  decimal_places: number;
  is_base: boolean;
  updated_at: string;
};

type ExchangeRateRow = {
  id: string;
  base_currency_id: string;
  quote_currency_id: string;
  rate: number | string;
  source: string;
  effective_at: string;
  updated_at: string;
};

function toNumber(value: number | string) {
  return typeof value === "number" ? value : Number(value);
}

export async function GET() {
  const access = await requireApiAccess();

  if ("response" in access) {
    return access.response;
  }

  const organizationId = access.workspace.organization.id;
  const [currenciesResult, exchangeRatesResult] = await Promise.all([
    access.supabase
      .from("currencies")
      .select("id, code, name, symbol, decimal_places, is_base, updated_at")
      .eq("organization_id", organizationId)
      .order("is_base", { ascending: false })
      .order("code", { ascending: true })
      .returns<CurrencyRow[]>(),
    access.supabase
      .from("exchange_rates")
      .select("id, base_currency_id, quote_currency_id, rate, source, effective_at, updated_at")
      .eq("organization_id", organizationId)
      .order("effective_at", { ascending: false })
      .returns<ExchangeRateRow[]>(),
  ]);

  if (currenciesResult.error) {
    return apiError(currenciesResult.error.message, 500);
  }

  if (exchangeRatesResult.error) {
    return apiError(exchangeRatesResult.error.message, 500);
  }

  const codeMap = new Map(
    (currenciesResult.data ?? []).map((currency) => [currency.id, currency.code]),
  );

  return NextResponse.json({
    data: {
      baseCurrencyCode:
        (currenciesResult.data ?? []).find((currency) => currency.is_base)?.code ?? null,
      items: (currenciesResult.data ?? []).map((currency) => ({
        id: currency.id,
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        decimalPlaces: currency.decimal_places,
        isBase: currency.is_base,
        updatedAt: currency.updated_at,
      })),
      exchangeRates: (exchangeRatesResult.data ?? []).map((rate) => ({
        id: rate.id,
        baseCurrencyId: rate.base_currency_id,
        baseCurrencyCode: codeMap.get(rate.base_currency_id) ?? "N/A",
        quoteCurrencyId: rate.quote_currency_id,
        quoteCurrencyCode: codeMap.get(rate.quote_currency_id) ?? "N/A",
        rate: toNumber(rate.rate),
        source: rate.source,
        effectiveAt: rate.effective_at,
        updatedAt: rate.updated_at,
      })),
    },
  });
}

export async function POST(request: NextRequest) {
  const access = await requireApiAccess(["admin", "editor"]);

  if ("response" in access) {
    return access.response;
  }

  const payload = await parseJsonBody(request);

  if (payload === null) {
    return apiError("Invalid JSON request body.", 400);
  }

  const kind = typeof payload.kind === "string" ? payload.kind : "currency";

  try {
    if (kind === "exchangeRate") {
      const input = exchangeRateCreateSchema.parse(payload);

      if (input.baseCurrencyId === input.quoteCurrencyId) {
        return apiError("Base and quote currencies must be different.", 400);
      }

      const currenciesResult = await access.supabase
        .from("currencies")
        .select("id")
        .eq("organization_id", access.workspace.organization.id)
        .in("id", [input.baseCurrencyId, input.quoteCurrencyId])
        .returns<Array<{ id: string }>>();

      if (currenciesResult.error) {
        return apiError(currenciesResult.error.message, 500);
      }

      if ((currenciesResult.data ?? []).length !== 2) {
        return apiError("Both currencies must belong to the active workspace.", 400);
      }

      const result = await access.supabase
        .from("exchange_rates")
        .insert({
          organization_id: access.workspace.organization.id,
          base_currency_id: input.baseCurrencyId,
          quote_currency_id: input.quoteCurrencyId,
          rate: input.rate,
          source: input.source,
          effective_at: input.effectiveAt ?? new Date().toISOString(),
          created_by: access.workspace.user.id,
        })
        .select("id, base_currency_id, quote_currency_id, rate, source, effective_at, updated_at")
        .maybeSingle<ExchangeRateRow>();

      if (result.error) {
        return apiError(result.error.message, 500);
      }

      return NextResponse.json(
        {
          data: {
            kind: "exchangeRate",
            ...result.data,
          },
        },
        { status: 201 },
      );
    }

    const input = currencyCreateSchema.parse(payload);

    if (input.isBase) {
      const resetResult = await access.supabase
        .from("currencies")
        .update({ is_base: false })
        .eq("organization_id", access.workspace.organization.id)
        .eq("is_base", true);

      if (resetResult.error) {
        return apiError(resetResult.error.message, 500);
      }
    }

    const result = await access.supabase
      .from("currencies")
      .insert({
        organization_id: access.workspace.organization.id,
        created_by: access.workspace.user.id,
        code: input.code.trim().toUpperCase(),
        name: input.name,
        symbol: input.symbol,
        decimal_places: input.decimalPlaces,
        is_base: input.isBase,
      })
      .select("id, code, name, symbol, decimal_places, is_base, updated_at")
      .maybeSingle<CurrencyRow>();

    if (result.error) {
      return apiError(result.error.message, 500);
    }

    return NextResponse.json(
      {
        data: {
          kind: "currency",
          id: result.data?.id,
          code: result.data?.code,
          name: result.data?.name,
          symbol: result.data?.symbol,
          decimalPlaces: result.data?.decimal_places,
          isBase: result.data?.is_base,
          updatedAt: result.data?.updated_at,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message ?? "Invalid currency payload.", 400);
    }

    return apiError("Unexpected currency mutation error.", 500);
  }
}
