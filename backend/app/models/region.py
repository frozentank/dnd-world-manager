from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base


class Region(Base):
    __tablename__ = "regions"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    description: Mapped[str | None] = mapped_column(Text)

    locations: Mapped[list["Location"]] = relationship(back_populates="region")
    npcs: Mapped[list["NPC"]] = relationship(back_populates="region")
