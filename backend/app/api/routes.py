from fastapi import APIRouter, Depends, HTTPException, status
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

@router.put("/npcs/{npc_id}", response_model=NPCRead)
def update_npc(npc_id: int, payload: NPCCreate, db: Session = Depends(get_db)):
    npc = db.get(NPC, npc_id)
    if npc is None:
        raise HTTPException(status_code=404, detail="NPC not found")

    for key, value in payload.model_dump().items():
        setattr(npc, key, value)

    db.commit()
    db.refresh(npc)
    return npc

@router.delete("/npcs/{npc_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_npc(npc_id: int, db: Session = Depends(get_db)):
    npc = db.get(NPC, npc_id)
    if npc is None:
        raise HTTPException(status_code=404, detail="NPC not found")

    db.delete(npc)
    db.commit()
    return None

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

@router.put("/locations/{location_id}", response_model=LocationRead)
def update_location(location_id: int, payload: LocationCreate, db: Session = Depends(get_db)):
    location = db.get(Location, location_id)
    if location is None:
        raise HTTPException(status_code=404, detail="Location not found")

    for key, value in payload.model_dump().items():
        setattr(location, key, value)

    db.commit()
    db.refresh(location)
    return location

@router.delete("/locations/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_location(location_id: int, db: Session = Depends(get_db)):
    location = db.get(Location, location_id)
    if location is None:
        raise HTTPException(status_code=404, detail="Location not found")

    db.delete(location)
    db.commit()
    return None

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
