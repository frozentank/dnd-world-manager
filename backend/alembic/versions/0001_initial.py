from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        "locations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("location_type", sa.String(50), nullable=False),
        sa.Column("is_major", sa.Boolean(), nullable=False),
    )
    op.create_index("ix_locations_name", "locations", ["name"], unique=True)

    op.create_table(
        "npcs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("title", sa.String(200)),
        sa.Column("description", sa.Text()),
        sa.Column("personality", sa.Text()),
        sa.Column("appearance", sa.Text()),
        sa.Column("secrets", sa.Text()),
        sa.Column("notes", sa.Text()),
        sa.Column("active", sa.Boolean(), nullable=False),
    )
    op.create_index("ix_npcs_name", "npcs", ["name"])

    op.create_table(
        "schedule_rules",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("npc_id", sa.Integer(), sa.ForeignKey("npcs.id", ondelete="CASCADE"), nullable=False),
        sa.Column("location_id", sa.Integer(), sa.ForeignKey("locations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("priority", sa.Integer(), nullable=False),
        sa.Column("start_minute", sa.Integer(), nullable=False),
        sa.Column("end_minute", sa.Integer(), nullable=False),
        sa.Column("day_of_week", sa.Integer()),
        sa.Column("probability", sa.Float(), nullable=False),
        sa.Column("condition", sa.Text()),
        sa.Column("enabled", sa.Boolean(), nullable=False),
    )

def downgrade():
    op.drop_table("schedule_rules")
    op.drop_index("ix_npcs_name", table_name="npcs")
    op.drop_table("npcs")
    op.drop_index("ix_locations_name", table_name="locations")
    op.drop_table("locations")
