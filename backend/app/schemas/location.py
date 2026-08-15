from pydantic import BaseModel, ConfigDict


class LocationBase(BaseModel):
    name: str
    description: str | None = None
    location_type: str = "other"
    is_major: bool = True
    region_id: int | None = None
    grid_location: str | None = None
    map_name: str | None = None


class LocationCreate(LocationBase):
    pass


class LocationRead(LocationBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
