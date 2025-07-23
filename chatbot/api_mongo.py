from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("MONGO_DB", "mydb")
COLLECTION_NAME = os.getenv("MONGO_COLLECTION", "products")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
products_collection = db[COLLECTION_NAME]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    # Récupère les produits depuis MongoDB
    products = list(products_collection.find({}, {"_id": 0}))
    context = "\n".join([f"Nom: {p.get('name', '')}, Description: {p.get('description', '')}, Secteur: {p.get('sector', '')}" for p in products])
    
    # Prépare le prompt
    template = """
    En te basant uniquement sur la liste de produits ci-dessous, réponds à la question de l'utilisateur. Si aucun produit ne correspond, propose poliment de contacter un conseiller.
    Produits :\n{context}\n
    Question : {question}
    """
    prompt = ChatPromptTemplate.from_template(template)
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    chain = prompt | llm
    response = chain.invoke({"context": context, "question": req.question})
    return {"response": response.content}
