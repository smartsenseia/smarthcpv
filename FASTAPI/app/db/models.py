from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.db.base import Base

class Measurement(Base):
    __tablename__ = "measurements"

    id = Column(Integer, primary_key=True, index=True)
    
    # Timestamp da medição
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    # Temperaturas (8 sinais)
    temp_1 = Column(Float) # entrada lado quente
    temp_2 = Column(Float) # saida lado quente
    temp_3 = Column(Float) # entrada lado frio
    temp_4 = Column(Float) # saída lado frio
    temp_5 = Column(Float) # temperatura entrada refrigeração
    temp_6 = Column(Float) # temperatura saida refrigeração
    temp_7 = Column(Float) # temperatura ambiente
    temp_8 = Column(Float) # temperatura do módulo 

    # Pressões (8 sinais)
    pressao_1 = Column(Float) # entrada lado quente
    pressao_2 = Column(Float) # saida lado quente
    pressao_3 = Column(Float) # entrada lado frio
    pressao_4 = Column(Float) # saida lado frio
    pressao_5 = Column(Float) # pressao no reservatorio de permeado


    # Indicadores adicionais
    condhot = Column(Float)              # Índice de recuperação (IJR)
    sec = Column(Float)              # Consumo específico de energia (SEC)
    gor = Column(Float)              # Razão ganho-produção (GOR)
    fluxo_permeado = Column(Float)   # Fluxo de permeado

