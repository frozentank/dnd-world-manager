from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Location(Base):
    __tablename__ = "locations"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    location_type: Mapped[str] = mapped_column(String(50), default="other")
    is_major: Mapped[bool] = mapped_column(Boolean, default=True)
    region_id: Mapped[int | None] = mapped_column(ForeignKey("regions.id", ondelete="SET NULL"), nullable=True)
    grid_location: Mapped[str | None] = mapped_column(String(200))
    map_name: Mapped[str | None] = mapped_column(String(200))

    region: Mapped["Region | None"] = relationship(back_populates="locations")
    npcs: Mapped[list["NPC"]] = relationship(back_populates="location")
    schedule_rules: Mapped[list["ScheduleRule"]] = relationship(
        back_populates="location", cascade="all, delete-orphan"
    )
