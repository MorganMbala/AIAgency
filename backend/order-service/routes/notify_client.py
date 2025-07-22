import requests

def notify_client(email, subject, body, pdf_url):
    payload = {
        "to": email,
        "subject": subject,
        "body": body,
        "pdf_url": pdf_url
    }
    # Correction de l'URL pour notification-service sur le port 8001
    response = requests.post("http://localhost:8001/send-confirmation", json=payload)
    print(f"Notification-service response: {response.status_code} {response.text}")

# Exemple d'utilisation après paiement
# def process_order(order, user_email, pdf_url):
#     subject = "Confirmation de votre commande"
#     body = "Merci pour votre commande ! Vous trouverez votre facture en pièce jointe."
#     notify_client(user_email, subject, body, pdf_url)
