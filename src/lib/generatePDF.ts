import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type Settings = {
  company_name: string
  email: string
  phone: string
  address: string
  gst_number: string
  currency: string
  payment_terms: string
  invoice_notes: string
}

type InvoiceItem = {
  description: string
  quantity: number
  rate: number
  amount: number
}

type Invoice = {
  invoice_number: string
  issue_date: string
  due_date: string
  status: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  notes: string
  clients: {
    name: string
    email: string
    phone: string
    address: string
    gst_number: string
  }
  invoice_items: InvoiceItem[]
}

const rs = (amount: number) => `Rs. ${amount?.toLocaleString('en-IN')}`

export function generateInvoicePDF(invoice: Invoice) {
  const settings: Settings = JSON.parse(
    localStorage.getItem('invoice_settings') || '{}'
  )

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const orange = [249, 115, 22] as [number, number, number]
  const dark = [15, 23, 42] as [number, number, number]
  const gray = [100, 116, 139] as [number, number, number]

  // Background Header
  doc.setFillColor(...dark)
  doc.rect(0, 0, pageWidth, 50, 'F')

  // Company Name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(settings.company_name || 'Your Company', 14, 20)

  // Company Details
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 180, 180)
  const companyDetails = [
    settings.email,
    settings.phone,
    settings.address,
    settings.gst_number ? `GST: ${settings.gst_number}` : '',
  ].filter(Boolean).join('  |  ')
  doc.text(companyDetails, 14, 30)

  // INVOICE text
  doc.setTextColor(...orange)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', pageWidth - 14, 22, { align: 'right' })

  // Invoice Number
  doc.setTextColor(180, 180, 180)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`#${invoice.invoice_number}`, pageWidth - 14, 32, { align: 'right' })

  // Status Badge
  const statusColors: Record<string, [number, number, number]> = {
    paid: [52, 211, 153],
    unpaid: [251, 191, 36],
    overdue: [248, 113, 113],
  }
  const statusColor = statusColors[invoice.status] || gray
  doc.setFillColor(...statusColor)
  doc.roundedRect(pageWidth - 45, 36, 30, 8, 2, 2, 'F')
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text(invoice.status.toUpperCase(), pageWidth - 30, 41.5, { align: 'center' })

  // Bill To + Invoice Info boxes
  doc.setFillColor(240, 242, 245)
  doc.roundedRect(14, 58, 85, 45, 3, 3, 'F')
  doc.roundedRect(pageWidth - 99, 58, 85, 45, 3, 3, 'F')

  // Bill To
  doc.setTextColor(...orange)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('BILL TO', 20, 67)

  doc.setTextColor(...dark)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(invoice.clients?.name || '', 20, 75)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...gray)
  const clientDetails = [
    invoice.clients?.email,
    invoice.clients?.phone,
    invoice.clients?.address,
    invoice.clients?.gst_number ? `GST: ${invoice.clients.gst_number}` : '',
  ].filter(Boolean)
  clientDetails.forEach((line, i) => doc.text(line, 20, 82 + i * 6))

  // Invoice Info
  doc.setTextColor(...orange)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE DETAILS', pageWidth - 93, 67)

  const infoRows = [
    ['Issue Date', invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('en-IN') : '-'],
    ['Due Date', invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-IN') : '-'],
    ['Payment Terms', settings.payment_terms || 'Due within 30 days'],
  ]

  infoRows.forEach(([label, value], i) => {
    doc.setTextColor(...gray)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(label, pageWidth - 93, 75 + i * 8)
    doc.setTextColor(...dark)
    doc.setFont('helvetica', 'bold')
    doc.text(value, pageWidth - 14, 75 + i * 8, { align: 'right' })
  })

  // Items Table
  autoTable(doc, {
    startY: 112,
    head: [['Description', 'Qty', 'Rate', 'Amount']],
    body: invoice.invoice_items?.map(item => [
      item.description,
      item.quantity.toString(),
      rs(item.rate),
      rs(item.amount),
    ]) || [],
    headStyles: {
      fillColor: dark,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      textColor: dark,
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
    margin: { left: 14, right: 14 },
  })

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 8

  const totals = [
    ['Subtotal', rs(invoice.subtotal)],
    [`Tax (${invoice.tax_rate}%)`, rs(invoice.tax_amount)],
  ]

  totals.forEach(([label, value], i) => {
    doc.setTextColor(...gray)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(label, pageWidth - 70, finalY + i * 8)
    doc.setTextColor(...dark)
    doc.text(value, pageWidth - 14, finalY + i * 8, { align: 'right' })
  })

  // Total line
  doc.setDrawColor(...orange)
  doc.setLineWidth(0.5)
  doc.line(pageWidth - 70, finalY + 18, pageWidth - 14, finalY + 18)

  // Total box
  doc.setFillColor(...orange)
  doc.roundedRect(pageWidth - 75, finalY + 21, 61, 12, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL', pageWidth - 70, finalY + 29)
  doc.text(rs(invoice.total), pageWidth - 16, finalY + 29, { align: 'right' })

  // Notes
  if (invoice.notes || settings.invoice_notes) {
    const notesY = finalY + 42
    doc.setFillColor(240, 242, 245)
    doc.roundedRect(14, notesY, pageWidth - 28, 20, 3, 3, 'F')
    doc.setTextColor(...orange)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('NOTES', 20, notesY + 7)
    doc.setTextColor(...gray)
    doc.setFont('helvetica', 'normal')
    doc.text(invoice.notes || settings.invoice_notes || '', 20, notesY + 14)
  }

  // Footer
  doc.setFillColor(...dark)
  doc.rect(0, 272, pageWidth, 25, 'F')
  doc.setTextColor(180, 180, 180)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Thank you for your business!', pageWidth / 2, 282, { align: 'center' })
  doc.setTextColor(...orange)
  doc.text(settings.company_name || 'Invoice Platform', pageWidth / 2, 289, { align: 'center' })

  doc.save(`${invoice.invoice_number}.pdf`)
}