"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface FeedbackItem {
    id: string;
    type: string;
    message: string;
    createdAt: Date;
    user: {
        name: string | null;
        email: string | null;
    } | null;
}

export function ExportPdfButton({ data }: { data: FeedbackItem[] }) {
    
    const handleExport = () => {
        const doc = new jsPDF();

        // Load logo
        const logoUrl = "/icon-512.png";
        const img = new Image();
        img.src = logoUrl;
        
        img.onload = () => {
             // Add Logo
            doc.addImage(img, 'PNG', 14, 10, 20, 20);

            // Add Title
            doc.setFontSize(18);
            doc.text("Relatório de Feedbacks", 40, 20);
            doc.setFontSize(10);
            doc.text("Barber Maps - " + new Date().toLocaleDateString('pt-BR'), 40, 27);

            // Prepare Data
            const tableData = data.map(item => [
                new Date(item.createdAt).toLocaleDateString('pt-BR') + ' ' + new Date(item.createdAt).toLocaleTimeString('pt-BR'),
                item.type,
                item.user?.name || "Anônimo",
                item.user?.email || "-",
                item.message
            ]);

            // Create Table
            autoTable(doc, {
                startY: 35,
                head: [['Data', 'Tipo', 'Usuário', 'Email', 'Mensagem']],
                body: tableData,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [0, 0, 0] }, // Black header to match theme
                columnStyles: {
                    0: { cellWidth: 25 },
                    1: { cellWidth: 20 },
                    2: { cellWidth: 30 },
                    3: { cellWidth: 40 },
                    4: { cellWidth: 'auto' },
                }
            });

            doc.save(`feedbacks-barbermaps-${new Date().toISOString().split('T')[0]}.pdf`);
        };

        img.onerror = () => {
             // Fallback without image if fails
             doc.setFontSize(18);
             doc.text("Relatório de Feedbacks", 14, 20);
             doc.text("Barber Maps", 14, 28);
             
             const tableData = data.map(item => [
                new Date(item.createdAt).toLocaleDateString('pt-BR'),
                item.type,
                item.user?.name || "Anônimo",
                item.message
            ]);

            autoTable(doc, {
                startY: 35,
                head: [['Data', 'Tipo', 'Usuário', 'Mensagem']],
                body: tableData,
            });
             
            doc.save(`feedbacks-barbermaps.pdf`);
        }
    };

    return (
        <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 size-4" />
            Exportar PDF
        </Button>
    );
}
