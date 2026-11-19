import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Farm, Alert, NDVIPoint } from '../types';
import { farmService } from './farmService';

interface GenerateReportOptions {
  farm?: Farm;
  allFarms?: Farm[];
  alerts?: Alert[];
  userEmail?: string;
  userName?: string;
  period?: string;
}

export const pdfReportService = {
  generateCropHealthReport(options: GenerateReportOptions): void {
    const {
      farm,
      allFarms = [],
      alerts = [],
      userEmail = 'utilizador@agrosat.ao',
      userName = 'Agricultor Registado',
    } = options;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const primaryColor: [number, number, number] = [30, 41, 27]; // #1E291B
    const accentColor: [number, number, number] = [75, 99, 68]; // #4B6344
    const darkTextColor: [number, number, number] = [40, 50, 36];
    const lightBg: [number, number, number] = [245, 247, 242];

    const todayStr = new Date().toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const timeStr = new Date().toLocaleTimeString('pt-AO', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // --- HEADER BANNER ---
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 38, 'F');

    // Title & Branding
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('AgroSat Angola', 14, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(220, 230, 210);
    doc.text('Relatório Oficial de Saúde da Vegetação & Monitorização NDVI', 14, 25);
    doc.text('Sensoriamento Remoto Sentinel-2 (ESA) | Integração INAMET', 14, 31);

    // Meta Badge on Top Right
    doc.setFontSize(8);
    doc.setTextColor(180, 200, 170);
    doc.text(`Data: ${todayStr} às ${timeStr}`, 196, 16, { align: 'right' });
    doc.text(`Doc ID: AS-REP-${Date.now().toString().slice(-6)}`, 196, 22, { align: 'right' });
    doc.text(`Angola - Monitorização Agrícola`, 196, 28, { align: 'right' });

    let currentY = 46;

    // --- PROPRIETÁRIO / CONTA ---
    doc.setFillColor(...lightBg);
    doc.roundedRect(14, currentY, 182, 20, 2, 2, 'F');
    doc.setDrawColor(220, 225, 215);
    doc.roundedRect(14, currentY, 182, 20, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.text('RESPONSÁVEL / UTILIZADOR:', 18, currentY + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(`${userName} (${userEmail})`, 75, currentY + 7);

    doc.setFont('helvetica', 'bold');
    doc.text('PROVÍNCIA / REGIÃO:', 18, currentY + 14);
    doc.setFont('helvetica', 'normal');
    doc.text(`${farm ? farm.province : 'Nacional / Várias Províncias'} — República de Angola`, 75, currentY + 14);

    currentY += 26;

    // --- SEÇÃO: PROPRIEDADE SELECIONADA OU VISÃO GERAL ---
    if (farm) {
      const farmHistory: NDVIPoint[] = farmService.getNdviHistory(farm.id);
      const latestPoint = farmHistory.length > 0 ? farmHistory[farmHistory.length - 1] : null;
      const ndviVal = latestPoint ? latestPoint.ndvi : 0.72;

      let healthStatus = 'Vegetação Saudável (Vigorosa)';
      let healthAdvice = 'Condição ideal de fotossíntese. Manter plano de nutrição e rega.';
      let statusColor: [number, number, number] = [46, 125, 50]; // Green

      if (ndviVal < 0.3) {
        healthStatus = 'Estresse Severo / Solo Exposto';
        healthAdvice = 'Urgente: Verificar déficit hídrico extremo ou ataque de pragas.';
        statusColor = [198, 40, 40];
      } else if (ndviVal < 0.5) {
        healthStatus = 'Estresse Moderado / Atenção';
        healthAdvice = 'Recomenda-se irrigação suplementar e análise foliar de nitrogênio.';
        statusColor = [230, 81, 0];
      } else if (ndviVal < 0.65) {
        healthStatus = 'Vegetação em Desenvolvimento Normal';
        healthAdvice = 'Crescimento regular. Monitorar índice de umidade e precipitação.';
        statusColor = [102, 187, 106];
      }

      // Title Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...primaryColor);
      doc.text(`1. Resumo da Propriedade: ${farm.name}`, 14, currentY);
      currentY += 6;

      const lat = farm.centerCoords ? farm.centerCoords.lat.toFixed(4) : '-12.7760';
      const lng = farm.centerCoords ? farm.centerCoords.lng.toFixed(4) : '15.7340';

      // Table 1: Dados Gerais da Fazenda
      autoTable(doc, {
        startY: currentY,
        head: [['Parâmetro', 'Detalhe Cadastrado', 'Parâmetro', 'Detalhe Cadastrado']],
        body: [
          ['Nome da Fazenda', farm.name, 'Cultura Principal', farm.mainCrop || 'Milho / Feijão'],
          ['Província / Município', `${farm.province} (${farm.locationName || 'Zona Rural'})`, 'Área Total Mapeada', `${farm.totalArea} Hectares`],
          ['Coordenadas Centrais', `${lat}°, ${lng}°`, 'Sistema de Irrigação', farm.irrigationType || 'Sequeiro'],
          ['Data de Plantio', farm.plantingDate || '15/10/2025', 'Satélite Fonte', 'Sentinel-2 Multispectral (10m)'],
        ],
        theme: 'striped',
        headStyles: {
          fillColor: accentColor,
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 8.5,
        },
        styles: {
          fontSize: 8,
          textColor: darkTextColor,
          cellPadding: 2.2,
        },
        alternateRowStyles: {
          fillColor: [248, 249, 246],
        },
        margin: { left: 14, right: 14 },
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;

      // Card de Saúde NDVI Atual
      doc.setFillColor(240, 246, 238);
      doc.roundedRect(14, currentY, 182, 26, 2, 2, 'F');
      doc.setDrawColor(...accentColor);
      doc.setLineWidth(0.4);
      doc.roundedRect(14, currentY, 182, 26, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...accentColor);
      doc.text('ÍNDICE DE VEGETAÇÃO ATUAL (NDVI)', 20, currentY + 7);

      doc.setFontSize(22);
      doc.setTextColor(...statusColor);
      doc.text(`${ndviVal.toFixed(2)}`, 20, currentY + 19);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Classificação: ${healthStatus}`, 52, currentY + 11);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 90, 75);
      doc.text(`Recomendação Técnica: ${healthAdvice}`, 52, currentY + 18);

      currentY += 34;

      // Table 2: Histórico Temporal de NDVI
      if (farmHistory && farmHistory.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...primaryColor);
        doc.text('2. Evolução Histórica do Índice NDVI (Série Temporal)', 14, currentY);
        currentY += 4;

        const tableRows = farmHistory.map((item) => {
          let statusText = 'Normal';
          if (item.ndvi >= 0.7) statusText = 'Excelente / Alta Biomassa';
          else if (item.ndvi >= 0.5) statusText = 'Bom / Médio Vigor';
          else if (item.ndvi >= 0.35) statusText = 'Atenção / Vigor Moderado';
          else statusText = 'Alerta / Baixa Atividade';

          return [
            item.date,
            item.ndvi.toFixed(2),
            statusText,
            item.precipitation !== undefined ? `${item.precipitation} mm` : '5 mm',
            item.temp !== undefined ? `${item.temp}°C` : '24°C',
            'Sentinel-2 (10m)',
          ];
        });

        autoTable(doc, {
          startY: currentY,
          head: [['Data da Passagem', 'Valor NDVI', 'Classificação da Saúde', 'Precipitação', 'Temp. Média', 'Sensor']],
          body: tableRows,
          theme: 'grid',
          headStyles: {
            fillColor: accentColor,
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 8,
          },
          styles: {
            fontSize: 7.5,
            textColor: darkTextColor,
            cellPadding: 2,
            halign: 'center',
          },
          columnStyles: {
            0: { halign: 'left' },
            2: { halign: 'left' },
          },
          margin: { left: 14, right: 14 },
        });

        currentY = (doc as any).lastAutoTable.finalY + 8;
      }
    } else {
      // Visão Geral de Todas as Fazendas
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...primaryColor);
      doc.text(`1. Resumo Consolidado do Portfólio Agrícola (${allFarms.length} Propriedades)`, 14, currentY);
      currentY += 4;

      const farmRows = allFarms.map((f) => {
        const hist = farmService.getNdviHistory(f.id);
        const lastNdvi = hist.length > 0 ? hist[hist.length - 1].ndvi : 0.72;
        return [
          f.name,
          f.province,
          f.mainCrop || 'Cereais/Hortícolas',
          `${f.totalArea} ha`,
          lastNdvi.toFixed(2),
          lastNdvi >= 0.65 ? 'Saudável' : 'Atenção',
        ];
      });

      autoTable(doc, {
        startY: currentY,
        head: [['Nome da Fazenda', 'Província', 'Cultura Principal', 'Área (ha)', 'NDVI Atual', 'Status Geral']],
        body: farmRows,
        theme: 'striped',
        headStyles: {
          fillColor: accentColor,
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 8.5,
        },
        styles: {
          fontSize: 8,
          textColor: darkTextColor,
          cellPadding: 2,
        },
        margin: { left: 14, right: 14 },
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;
    }

    // --- SEÇÃO: ALERTAS & RECOMENDAÇÕES AGRONÔMICAS ---
    // Check if we need page break
    if (currentY > 220) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text('3. Diagnóstico de Alertas & Recomendações Técnicas AgroSat', 14, currentY);
    currentY += 5;

    const farmAlerts = farm
      ? alerts.filter((a) => a.farmId === farm.id || !a.farmId)
      : alerts;

    if (farmAlerts.length > 0) {
      const alertRows = farmAlerts.slice(0, 4).map((a) => [
        a.severity ? a.severity.toUpperCase() : 'AVISO',
        a.title,
        a.message,
        a.date || todayStr,
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['Gravidade', 'Tipo de Alerta', 'Descrição & Ação Sugerida', 'Data']],
        body: alertRows,
        theme: 'grid',
        headStyles: {
          fillColor: [60, 75, 55],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 8,
        },
        styles: {
          fontSize: 7.5,
          textColor: darkTextColor,
          cellPadding: 2.5,
        },
        columnStyles: {
          0: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
          1: { cellWidth: 38, fontStyle: 'bold' },
          2: { cellWidth: 95 },
          3: { cellWidth: 27, halign: 'center' },
        },
        margin: { left: 14, right: 14 },
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;
    } else {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 110, 95);
      doc.text('Nenhum alerta crítico ou estresse detectado nas últimas passagens de satélite.', 14, currentY);
      currentY += 8;
    }

    // --- SEÇÃO: GUIA PRÁTICO DA ESCALA NDVI ---
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(250, 252, 248);
    doc.roundedRect(14, currentY, 182, 24, 2, 2, 'F');
    doc.setDrawColor(215, 222, 210);
    doc.roundedRect(14, currentY, 182, 24, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...primaryColor);
    doc.text('ESCALA DE REFERÊNCIA NDVI SENTINEL-2 (0.00 a 1.00):', 18, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 70, 55);
    doc.text('• 0.00 - 0.20: Água, rochas ou solo desprovido de vegetação.', 18, currentY + 11);
    doc.text('• 0.20 - 0.40: Vegetação muito esparsa, germinação inicial ou estresse severo.', 18, currentY + 15);
    doc.text('• 0.40 - 0.65: Vegetação moderada em fase de crescimento ativo.', 18, currentY + 19);
    doc.text('• 0.65 - 1.00: Vegetação densa, vigorosa e alta concentração de clorofila.', 110, currentY + 19);

    // --- FOOTER & VALIDATION STAMP ---
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(200, 210, 195);
      doc.line(14, 282, 196, 282);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(120, 130, 115);
      doc.text(
        'AgroSat Angola — Inteligência Agrícola vinda do Espaço | Documento gerado eletronicamente para fins de gestão agrícola.',
        14,
        287
      );
      doc.text(`Página ${i} de ${pageCount}`, 196, 287, { align: 'right' });
    }

    // Save & trigger download
    const filename = farm
      ? `Relatorio_NDVI_${farm.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`
      : `Relatorio_Geral_AgroSat_${new Date().toISOString().slice(0, 10)}.pdf`;

    doc.save(filename);
  },
};
