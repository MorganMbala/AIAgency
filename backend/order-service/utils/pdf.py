from fpdf import FPDF
import os
import qrcode

def generate_invoice_pdf(order, cart_items, user_name=None):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    # Logo PNG en haut à droite (nom sans espace)
    logo_path = os.path.join("static", "invoices", "logo (1).png")
    if os.path.exists(logo_path):
        pdf.image(logo_path, x=165, y=10, w=25)
    # Logo et titre
    pdf.set_font("Arial", 'B', 22)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 15, "Invoice", ln=True, align="L")
    pdf.set_font("Arial", 'B', 22)
    pdf.set_text_color(150, 150, 150)
    pdf.cell(0, 10, "E-WebGo", ln=True, align="R")
    pdf.ln(2)
    # Infos facture
    pdf.set_font("Arial", '', 12)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(60, 8, f"Invoice number", ln=False)
    pdf.cell(60, 8, f"{order.id:04d}", ln=False)
    pdf.cell(0, 8, f"Date of issue", ln=False)
    pdf.cell(0, 8, f"{order.date.strftime('%B %d, %Y') if hasattr(order, 'date') else ''}", ln=True)
    pdf.cell(60, 8, f"Date due", ln=False)
    pdf.cell(60, 8, f"{order.due_date.strftime('%B %d, %Y') if hasattr(order, 'due_date') else ''}", ln=True)
    pdf.ln(2)
    # Section E-WebGo et Bill to côte à côte
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(60, 8, "E-WebGo", ln=False)
    pdf.set_font("Arial", '', 12)
    pdf.cell(60, 8, "Canada", ln=False)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 8, "Bill to", ln=True)
    pdf.set_font("Arial", '', 12)
    pdf.cell(120, 8, "", ln=False)
    pdf.cell(0, 8, f"{user_name if user_name else order.user_id}", ln=True)
    pdf.ln(2)
    # Montant mis en avant
    pdf.set_font("Arial", 'B', 16)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(0, 12, f"C${order.total:.2f} due {order.due_date.strftime('%B %d, %Y') if hasattr(order, 'due_date') else ''}", ln=True)
    pdf.ln(4)
    # Table header
    pdf.set_font("Arial", '', 11)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(80, 8, "Description", border="B")
    pdf.cell(25, 8, "Qty", border="B", align="C")
    pdf.cell(35, 8, "Unit price", border="B", align="R")
    pdf.cell(35, 8, "Amount", border="B", align="R")
    pdf.ln()
    pdf.set_font("Arial", '', 12)
    pdf.set_text_color(0, 0, 0)
    # Table rows
    subtotal = 0
    for item in cart_items:
        name = item.get('name', str(item.get('product_id', '')))
        desc = item.get('description', '')
        qty = item.get('quantity', 1)
        price = float(item.get('price', 0))
        amount = qty * price
        subtotal += amount
        description = name + (f" | {desc}" if desc else "")
        x_before = pdf.get_x()
        y_before = pdf.get_y()
        pdf.multi_cell(80, 8, description, border=0)
        x_after = x_before + 80
        y_after = pdf.get_y()
        pdf.set_xy(x_after, y_before)
        pdf.cell(25, 8, str(qty), border=0, align="C")
        pdf.cell(35, 8, f"C${price:.2f}", border=0, align="R")
        pdf.cell(35, 8, f"C${amount:.2f}", border=0, align="R")
        pdf.ln(max(8, y_after - y_before))
    # Totals
    pdf.set_font("Arial", '', 12)
    pdf.cell(105, 8, "", border=0)
    pdf.cell(35, 8, "Subtotal", border=0, align="R")
    pdf.cell(35, 8, f"C${subtotal:.2f}", border=0, align="R")
    pdf.ln()
    pdf.cell(105, 8, "", border=0)
    pdf.cell(35, 8, "Total", border=0, align="R")
    pdf.cell(35, 8, f"C${order.total:.2f}", border=0, align="R")
    pdf.ln()
    pdf.cell(105, 8, "", border=0)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(35, 8, "Amount due", border=0, align="R")
    pdf.cell(35, 8, f"C${order.total:.2f}", border=0, align="R")
    # Save PDF
    filename = f"invoice_{order.id}.pdf"
    path = os.path.join("static", "invoices", filename)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    # Génération du QR code (URL du PDF)
    pdf_url = f"https://ton-domaine.com/static/invoices/{filename}"  # adapte l'URL à ton domaine
    qr_img_path = os.path.join("static", "invoices", f"qr_{order.id}.png")
    qr = qrcode.make(pdf_url)
    qr.save(qr_img_path)
    # Ajout du QR code en bas à gauche de la page
    pdf.image(qr_img_path, x=10, y=260, w=30)
    pdf.output(path)
    return filename
