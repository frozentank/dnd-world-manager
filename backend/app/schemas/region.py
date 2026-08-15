from pydantic import BaseModel, ConfigDict


class RegionBase(BaseModel):
    name: str
    description: str | None = None


class RegionCreate(RegionBase):
    pass


class RegionRead(RegionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
