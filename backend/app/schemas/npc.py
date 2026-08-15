from pydantic import BaseModel, ConfigDict

class NPCBase(BaseModel):
    name: str
    title: str | None = None
    description: str | None = None
    personality: str | None = None
    appearance: str | None = None
    secrets: str | None = None
    notes: str | None = None
    active: bool = True

class NPCCreate(NPCBase):
    pass

class NPCRead(NPCBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
