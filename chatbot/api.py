from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    llm = ChatOpenAI(model="gpt-4o-mini")
    response = llm.invoke(req.question)
    return {"response": response.content}