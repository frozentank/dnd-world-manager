from pydantic import BaseModel, ConfigDict, Field

class ScheduleRuleBase(BaseModel):
    npc_id: int
    location_id: int
    name: str
    priority: int = 0
    start_minute: int = Field(0, ge=0, le=1439)
    end_minute: int = Field(1439, ge=0, le=1439)
    day_of_week: int | None = Field(None, ge=0, le=6)
    probability: float = Field(1.0, ge=0)
    condition: str | None = None
    enabled: bool = True

class ScheduleRuleCreate(ScheduleRuleBase):
    pass

class ScheduleRuleRead(ScheduleRuleBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
