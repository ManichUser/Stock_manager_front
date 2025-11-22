// src/utils/exportUtils.ts
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Part } from '@/app/types/models';

export const exportToExcel = (parts: Part[]) => {
  const totalStock = parts.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = parts.reduce((sum, p) => sum + p.stock * p.price, 0);

  const wsData = parts.map(p => ({
    ID: p.id,
    Nom: p.name,
    Description: p.description ?? "",
    Stock: p.stock,
    Prix: p.price,
    Valeur: p.stock * p.price
  }));

  wsData.push({
    ID: 0,
    Nom: "TOTAL",
    Description: "",
    Stock: totalStock,
    Prix: 0,
    Valeur: totalValue
  });

  const ws = XLSX.utils.json_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Stock");
  XLSX.writeFile(wb, "rapport_stock.xlsx");
};

export const exportToPDF = (parts: Part[]) => {
  const totalStock = parts.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = parts.reduce((sum, p) => sum + p.stock * p.price, 0);

  const doc = new jsPDF();
  doc.text("Rapport Stock", 14, 15);

  const tableData = parts.map(p => [
    p.id, p.name, p.description ?? "", p.stock, p.price, p.stock * p.price
  ]);
  tableData.push(["", "TOTAL", "", totalStock, "", totalValue]);

  (doc as any).autoTable({
    head: [["ID", "Nom", "Description", "Stock", "Prix", "Valeur"]],
    body: tableData,
    startY: 20
  });

  doc.save("rapport_stock.pdf");
};
