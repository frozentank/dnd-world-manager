import csv
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Location, NPC, Region


def _clean(value: str | None) -> str | None:
    if value is None:
        return None
    cleaned = value.strip()
    return cleaned or None


def _match_name(record_name: str | None, candidates: list[Location | Region]) -> int | None:
    cleaned = _clean(record_name)
    if cleaned is None:
        return None
    for candidate in candidates:
        if candidate.name.strip().lower() == cleaned.lower():
            return candidate.id
    return None


def _build_description(row: dict[str, str | None]) -> str | None:
    profession = _clean(row.get("Profession"))
    race = _clean(row.get("Race"))
    gender = _clean(row.get("Gender"))
    quirk = _clean(row.get("Quirk"))
    appearance = _clean(row.get("Appearance"))

    parts: list[str] = []
    if profession:
        parts.append(profession)
    if race:
        parts.append(race)
    if gender:
        parts.append(gender)

    summary = ", ".join(parts) if parts else None
    extras = [piece for piece in [appearance, quirk] if piece]
    if summary and extras:
        return f"{summary}. {'. '.join(extras)}."
    if summary:
        return summary
    if extras:
        return ". ".join(extras)
    return None


def import_npcs_from_csv(db: Session, csv_path: str | Path) -> list[NPC]:
    path = Path(csv_path)
    if not path.exists():
        raise FileNotFoundError(f"CSV file not found: {path}")

    created: list[NPC] = []
    locations = db.scalars(select(Location)).all()
    regions = db.scalars(select(Region)).all()

    with path.open("r", encoding="utf-8", newline="") as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            name = _clean(row.get("Name"))
            if not name:
                continue

            location_name = _clean(row.get("Location"))
            region_name = _clean(row.get("Region"))

            location_id = _match_name(location_name, locations)
            region_id = _match_name(region_name, regions)

            if location_id is None and location_name:
                location = db.scalar(select(Location).where(Location.name.ilike(location_name)))
                if location is not None:
                    location_id = location.id
                    locations.append(location)

            if region_id is None and region_name:
                region = db.scalar(select(Region).where(Region.name.ilike(region_name)))
                if region is not None:
                    region_id = region.id
                    regions.append(region)

            npc = NPC(
                name=name,
                title=None,
                description=_build_description(row),
                profession=_clean(row.get("Profession")),
                race=_clean(row.get("Race")),
                gender=_clean(row.get("Gender")),
                quirk=_clean(row.get("Quirk")),
                personality=None,
                appearance=_clean(row.get("Appearance")),
                secrets=_clean(row.get("Secrets")),
                notes=_clean(row.get("Notes")),
                location_id=location_id,
                region_id=region_id,
                active=True,
            )
            db.add(npc)
            created.append(npc)

    db.commit()
    for npc in created:
        db.refresh(npc)
    return created
