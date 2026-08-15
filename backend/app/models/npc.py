from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class NPC(Base):
    __tablename__ = "npcs"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), index=True)
    title: Mapped[str | None] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(Text)
    profession: Mapped[str | None] = mapped_column(String(200))
    race: Mapped[str | None] = mapped_column(String(100))
    gender: Mapped[str | None] = mapped_column(String(50))
    quirk: Mapped[str | None] = mapped_column(Text)
    personality: Mapped[str | None] = mapped_column(Text)
    appearance: Mapped[str | None] = mapped_column(Text)
    secrets: Mapped[str | None] = mapped_column(Text)
    notes: Mapped[str | None] = mapped_column(Text)
    location_id: Mapped[int | None] = mapped_column(ForeignKey("locations.id", ondelete="SET NULL"), nullable=True)
    region_id: Mapped[int | None] = mapped_column(ForeignKey("regions.id", ondelete="SET NULL"), nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)

    location: Mapped["Location | None"] = relationship(back_populates="npcs")
    region: Mapped["Region | None"] = relationship(back_populates="npcs")
    schedule_rules: Mapped[list["ScheduleRule"]] = relationship(
        back_populates="npc", cascade="all, delete-orphan"
    )
