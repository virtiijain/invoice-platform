export interface Client {
  id: string
  user_id: string
  name: string
  email: string
  phone?: string
  address?: string
  gst_number?: string
  created_at: string
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface Invoice {
  id: string
  user_id: string
  client_id: string
  invoice_number: string
  status: 'paid' | 'unpaid' | 'overdue'
  issue_date: string
  due_date: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  notes?: string
  created_at: string
  clients?: Client
}