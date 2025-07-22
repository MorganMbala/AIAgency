from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import requests

app = FastAPI()

class EmailRequest(BaseModel):
    to: str
    subject: str
    body: str
    pdf_url: str = None  # lien vers la facture PDF

def send_gmail(to, subject, body, pdf_url=None):
    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['From'] = "morganmbala03@gmail.com"
    msg['To'] = to

    msg.attach(MIMEText(body, 'plain'))

    # Télécharger le PDF et l'attacher
    if pdf_url:
        response = requests.get(pdf_url)
        if response.status_code == 200:
            part = MIMEApplication(response.content, Name="facture.pdf")
            part['Content-Disposition'] = 'attachment; filename="facture.pdf"'
            msg.attach(part)
        else:
            msg.attach(MIMEText(f"\nImpossible de joindre la facture, lien : {pdf_url}", 'plain'))

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login("morganmbala03@gmail.com", "fgai bmse zedh aaqj")
        server.sendmail(msg['From'], [to], msg.as_string())

@app.post("/send-confirmation")
async def send_confirmation(email: EmailRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_gmail, email.to, email.subject, email.body, email.pdf_url)
    return {"message": "Email envoyé"}
