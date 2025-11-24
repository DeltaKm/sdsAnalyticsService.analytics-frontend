import type { AnalyticsResponse } from "./types";

export const mockOverviewData: AnalyticsResponse = {
  kpi: {
    venduto: 45678.50,
    numero_vendite: 234,
    media_vendita: 195.20,
    venduto_coperto: 38900.00,
    numero_coperti: 456,
    media_coperto: 85.30,
  },
  chart: {
    series: [
      {
        name: "Scontrini",
        data: [
          { x: "00", y: 450 },
          { x: "01", y: 320 },
          { x: "02", y: 180 },
          { x: "06", y: 890 },
          { x: "07", y: 1200 },
          { x: "08", y: 1450 },
          { x: "12", y: 3200 },
          { x: "13", y: 3800 },
          { x: "14", y: 2900 },
          { x: "19", y: 4200 },
          { x: "20", y: 5100 },
          { x: "21", y: 4800 },
          { x: "22", y: 3200 },
          { x: "23", y: 1800 },
        ],
      },
      {
        name: "Tavoli",
        data: [
          { x: "00", y: 200 },
          { x: "01", y: 150 },
          { x: "02", y: 80 },
          { x: "06", y: 450 },
          { x: "07", y: 680 },
          { x: "08", y: 890 },
          { x: "12", y: 2100 },
          { x: "13", y: 2600 },
          { x: "14", y: 1900 },
          { x: "19", y: 3200 },
          { x: "20", y: 3800 },
          { x: "21", y: 3500 },
          { x: "22", y: 2200 },
          { x: "23", y: 1200 },
        ],
      },
    ],
    xLabel: "Ora",
    yLabel: "Incasso (€)",
  },
  table: {
    columns: [
      { key: "store", label: "Punto Vendita", align: "left" },
      { key: "tipo_documento", label: "Tipo Documento", align: "left" },
      { key: "numero_vendite", label: "N. Vendite", align: "right" },
      { key: "venduto", label: "Venduto", align: "right" },
    ],
    rows: [
      { store: "Ristorante Centro", tipo_documento: "Scontrino", numero_vendite: 145, venduto: 28900.50 },
      { store: "Ristorante Centro", tipo_documento: "Fattura", numero_vendite: 23, venduto: 5670.00 },
      { store: "Pizzeria Nord", tipo_documento: "Scontrino", numero_vendite: 89, venduto: 15890.00 },
      { store: "Pizzeria Nord", tipo_documento: "Fattura", numero_vendite: 12, venduto: 3420.00 },
      { store: "Bar Sud", tipo_documento: "Scontrino", numero_vendite: 234, venduto: 8900.50 },
    ],
  },
};

export const mockSalesData: AnalyticsResponse = {
  kpi: {
    totale_venduto: 45678.50,
    numero_vendite: 234,
    media_vendita: 195.20,
  },
  chart: {
    series: [
      {
        name: "Vendite",
        data: [
          { x: "Ristorante Centro", y: 28900 },
          { x: "Pizzeria Nord", y: 15890 },
          { x: "Bar Sud", y: 8900 },
          { x: "Caffetteria Est", y: 12450 },
        ],
      },
    ],
    xLabel: "Punto Vendita",
    yLabel: "Incasso (€)",
  },
  table: {
    columns: [
      { key: "store", label: "Punto Vendita", align: "left" },
      { key: "vendite", label: "N. Vendite", align: "right" },
      { key: "incasso", label: "Incasso", align: "right" },
      { key: "media", label: "Media", align: "right" },
    ],
    rows: [
      { store: "Ristorante Centro", vendite: 168, incasso: 34570.50, media: 205.78 },
      { store: "Pizzeria Nord", vendite: 101, incasso: 19310.00, media: 191.19 },
      { store: "Bar Sud", vendite: 234, incasso: 8900.50, media: 38.03 },
      { store: "Caffetteria Est", vendite: 156, incasso: 12450.00, media: 79.81 },
    ],
  },
};

export const mockCatalogData: AnalyticsResponse = {
  kpi: {},
  chart: {
    series: [
      {
        name: "Quantità",
        data: [
          { x: "Pizza Margherita", y: 234 },
          { x: "Pasta Carbonara", y: 189 },
          { x: "Bistecca", y: 145 },
          { x: "Insalata", y: 123 },
          { x: "Tiramisù", y: 98 },
          { x: "Caffè", y: 456 },
          { x: "Birra", y: 234 },
          { x: "Vino Rosso", y: 178 },
        ],
      },
    ],
    xLabel: "Prodotto",
    yLabel: "Quantità",
  },
  table: {
    columns: [
      { key: "codice", label: "Codice", align: "left" },
      { key: "prodotto", label: "Prodotto", align: "left" },
      { key: "quantita", label: "Quantità", align: "right" },
      { key: "venduto", label: "Venduto", align: "right" },
      { key: "media", label: "Media", align: "right" },
    ],
    rows: [
      { codice: "P001", prodotto: "Pizza Margherita", quantita: 234, venduto: 2106.00, media: 9.00 },
      { codice: "P002", prodotto: "Pasta Carbonara", quantita: 189, venduto: 2268.00, media: 12.00 },
      { codice: "P003", prodotto: "Bistecca", quantita: 145, venduto: 3625.00, media: 25.00 },
      { codice: "P004", prodotto: "Insalata", quantita: 123, venduto: 738.00, media: 6.00 },
      { codice: "P005", prodotto: "Tiramisù", quantita: 98, venduto: 588.00, media: 6.00 },
    ],
  },
};

export const mockChannelsData: AnalyticsResponse = {
  kpi: {},
  chart: {
    series: [
      {
        name: "Incasso",
        data: [
          { x: "Banco", y: 12450 },
          { x: "Tavoli", y: 28900 },
          { x: "Consegne", y: 8900 },
          { x: "Ritiri", y: 5670 },
          { x: "Prenotazioni", y: 3420 },
        ],
      },
    ],
    xLabel: "Canale",
    yLabel: "Incasso (€)",
  },
  table: {
    columns: [
      { key: "canale", label: "Canale", align: "left" },
      { key: "vendite", label: "N. Vendite", align: "right" },
      { key: "incasso", label: "Incasso", align: "right" },
    ],
    rows: [
      { canale: "Banco", vendite: 234, incasso: 12450.00 },
      { canale: "Tavoli", vendite: 168, incasso: 28900.50 },
      { canale: "Consegne", vendite: 89, incasso: 8900.00 },
      { canale: "Ritiri", vendite: 45, incasso: 5670.00 },
      { canale: "Prenotazioni", vendite: 23, incasso: 3420.00 },
    ],
  },
};

export const mockOperatorsData: AnalyticsResponse = {
  kpi: {},
  chart: {
    series: [
      {
        name: "Incasso",
        data: [
          { x: "Mario Rossi", y: 15890 },
          { x: "Laura Bianchi", y: 12450 },
          { x: "Giuseppe Verdi", y: 9870 },
          { x: "Anna Neri", y: 7650 },
        ],
      },
    ],
    xLabel: "Operatore",
    yLabel: "Incasso (€)",
  },
  table: {
    columns: [
      { key: "nome", label: "Nome", align: "left" },
      { key: "vendite", label: "N. Vendite", align: "right" },
      { key: "incasso", label: "Incasso", align: "right" },
    ],
    rows: [
      { nome: "Mario Rossi", vendite: 89, incasso: 15890.00 },
      { nome: "Laura Bianchi", vendite: 67, incasso: 12450.00 },
      { nome: "Giuseppe Verdi", vendite: 54, incasso: 9870.00 },
      { nome: "Anna Neri", vendite: 43, incasso: 7650.00 },
    ],
  },
};
