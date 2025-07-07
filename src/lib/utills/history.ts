import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

import Logo from "../../../public/imgs/fundable_logo.png";
import { DistributionAttributes, RecipientData } from "@/types/distribution";

export const generateDistributionPDF = (
  distribution: DistributionAttributes
) => {
  const recipients = distribution?.recipients ?? [];
  const hasLabels = recipients.some((r) => r.label);

  const doc = new jsPDF() as jsPDF & { lastAutoTable: { finalY: number } };

  // Add logo
  doc.addImage(
    Logo.src,
    "PNG",
    (doc.internal.pageSize.width - 40) / 2,
    10,
    40,
    10
  );

  // Add title
  doc.setFontSize(20);
  doc.setTextColor(91, 33, 182);
  doc.text("Distribution Details", 14, 50);

  // Add content
  const details = [
    ["ID", distribution.id],
    ["Status", distribution.status],
    ["Distribution Type", distribution.distribution_type],
    ["Total Recipients", distribution.total_recipients.toString()],
    ["Network", distribution.network],
    ["Chain", distribution.chain_name],
    [
      "Total Amount",
      `${distribution.total_amount} ${distribution.token_symbol}`,
    ],
    ["Fee Amount", `${distribution.fee_amount} ${distribution.token_symbol}`],
    ["Transaction Date", new Date(distribution.created_at).toLocaleString()],
    ["Transaction Hash", distribution.transaction_hash || "N/A"],
  ];

  autoTable(doc, {
    startY: 55,
    body: details,
    theme: "plain",
    styles: {
      fontSize: 10,
      textColor: [0, 0, 0],
      cellPadding: 4,
    },
    columnStyles: {
      0: {
        cellWidth: 40,
        fontStyle: "bold",
        textColor: [91, 33, 182],
      },
    },
  });

  // Add recipients table
  doc.setFontSize(16);
  doc.setTextColor(91, 33, 182);
  const finalY = doc.lastAutoTable.finalY || 55;
  doc.text("Recipients", 14, finalY + 15);

  autoTable(doc, {
    startY: finalY + 20,
    head: [hasLabels ? ["Address", "Amount", "Label"] : ["Address", "Amount"]],
    body: recipients.map((recipient) =>
      hasLabels
        ? [
            recipient.address,
            `${recipient.amount} ${distribution.token_symbol}`,
            recipient.label || "-",
          ]
        : [
            recipient.address,
            `${recipient.amount} ${distribution.token_symbol}`,
          ]
    ),
    theme: "grid",
    headStyles: {
      fillColor: [91, 33, 182],
      fontSize: 12,
      fontStyle: "bold",
      halign: "left",
    },
    styles: {
      fontSize: 9,
      cellPadding: 5,
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 255],
    },
  });

  // Save the PDF
  doc.save(`distribution-${distribution.id}.pdf`);
};

export const generateDistributionCSV = async (
  distribution: DistributionAttributes
) => {
  if (!distribution.recipients?.length) {
    // console.error("No metadata found for distribution");
    return;
  }

  const recipients: RecipientData[] = distribution.recipients || [];
  const hasLabels = recipients.some((r) => r.label);

  // Create CSV content
  const csvContent = [
    ["Distribution Details"],
    ["ID", distribution.id],
    ["Status", distribution.status],
    ["Distribution Type", distribution.distribution_type],
    ["Total Recipients", distribution.total_recipients.toString()],
    ["Network", distribution.network],
    ["Chain", distribution.chain_name],
    [
      "Total Amount",
      `${distribution.total_amount} ${distribution.token_symbol}`,
    ],
    ["Fee Amount", `${distribution.fee_amount} ${distribution.token_symbol}`],
    ["Transaction Date", new Date(distribution.created_at).toLocaleString()],
    ["Transaction Hash", distribution.transaction_hash || "N/A"],
    [],
    ["Recipients"],
    hasLabels ? ["Address", "Amount", "Label"] : ["Address", "Amount"],
    ...recipients.map((recipient) =>
      hasLabels
        ? [recipient.address, recipient.amount, recipient.label || ""]
        : [recipient.address, recipient.amount]
    ),
  ]
    .map((row) => row.join(","))
    .join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `distribution_${distribution.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Function to get the explorer URL based on network and tx hash
export const getExplorerUrl = (
  distribution: DistributionAttributes,
  chainExplorer: string
) => {
  if (!distribution?.transaction_hash || !distribution?.network) return;

  const { transaction_hash } = distribution;

  const baseUrl = chainExplorer;

  return `${baseUrl}/tx/${transaction_hash}`;
};
