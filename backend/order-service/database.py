from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@127.0.0.1:3306/order_service_db")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Test de connexion à la base MySQL au démarrage
try:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    print("[OrderService] Connexion MySQL OK!")
except Exception as e:
    print(f"[OrderService] Erreur connexion MySQL: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
