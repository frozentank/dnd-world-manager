from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import Location, NPC, ScheduleRule
from app.schemas.location import LocationCreate, LocationRead
from app.schemas.npc import NPCCreate, NPCRead
from app.schemas.schedule import ScheduleRuleCreate, ScheduleRuleRead

router = APIRouter()

@router.get("/npcs", response_model=list[NPCRead])
def list_npcs(db: Session = Depends(get_db)):
    return db.scalars(select(NPC).order_by(NPC.name)).all()

@router.post("/npcs", response_model=NPCRead, status_code=201)
def create_npc(payload: NPCCreate, db: Session = Depends(get_db)):
    npc = NPC(**payload.model_dump())
    db.add(npc)
    db.commit()
    db.refresh(npc)
    return npc

@router.get("/locations", response_model=list[LocationRead])
def list_locations(db: Session = Depends(get_db)):
    return db.scalars(select(Location).order_by(Location.name)).all()

@router.post("/locations", response_model=LocationRead, status_code=201)
def create_location(payload: LocationCreate, db: Session = Depends(get_db)):
    location = Location(**payload.model_dump())
    db.add(location)
    db.commit()
    db.refresh(location)
    return location

@router.get("/schedule-rules", response_model=list[ScheduleRuleRead])
def list_schedule_rules(db: Session = Depends(get_db)):
    return db.scalars(select(ScheduleRule).order_by(ScheduleRule.priority.desc())).all()

@router.post("/schedule-rules", response_model=ScheduleRuleRead, status_code=201)
def create_schedule_rule(payload: ScheduleRuleCreate, db: Session = Depends(get_db)):
    rule = ScheduleRule(**payload.model_dump())
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule
