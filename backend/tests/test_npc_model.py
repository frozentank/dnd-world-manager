from app.models.npc import NPC


def test_import_fields_exist_on_npc_model():
    columns = {column.name for column in NPC.__table__.columns}

    assert "profession" in columns
    assert "race" in columns
    assert "gender" in columns
    assert "location_id" in columns
    assert "region_id" in columns
