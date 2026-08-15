from pydantic import BaseModel, ConfigDict

class LocationBase(BaseModel):
    name: str
    description: str | None = None
    location_type: str = "other"
    is_major: bool = True

class LocationCreate(LocationBase):
    pass

class LocationRead(LocationBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
