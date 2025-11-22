'use client';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import { Part } from "../types/models";

interface ExportButtonsProps {
  parts: Part[];
  totalStock: number;
  totalValue: number;
}

export default function ExportButtons({ parts, totalStock, totalValue }: ExportButtonsProps) {

  const exportExcel = () => {
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

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Rapport Stock", 14, 15);

    const tableData = parts.map(p => [
      p.id,
      p.name,
      p.description ?? "",
      p.stock,
      p.price,
      p.stock * p.price
    ]);
    tableData.push(["", "TOTAL", "", totalStock, "", totalValue]);

    // Utiliser autoTable(doc, options)
    autoTable(doc, {
      head: [["ID", "Nom", "Description", "Stock", "Prix", "Valeur"]],
      body: tableData,
      startY: 20
    });

    doc.save("rapport_stock.pdf");
  };

  return (
    <div className="flex gap-2">
      <button onClick={exportExcel} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
        Export Excel
      </button>
      <button onClick={exportPDF} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
        Export PDF
      </button>
    </div>
  );
}
