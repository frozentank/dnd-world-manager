from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Location(Base):
    __tablename__ = "locations"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    location_type: Mapped[str] = mapped_column(String(50), default="other")
    is_major: Mapped[bool] = mapped_column(Boolean, default=True)

    schedule_rules: Mapped[list["ScheduleRule"]] = relationship(
        back_populates="location", cascade="all, delete-orphan"
    )
