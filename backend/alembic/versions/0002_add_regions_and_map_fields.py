from alembic import op
import sqlalchemy as sa

revision = "0002_add_regions_and_map_fields"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "regions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text()),
    )
    op.create_index(op.f("ix_regions_name"), "regions", ["name"], unique=True)

    with op.batch_alter_table("locations") as batch_op:
        batch_op.add_column(sa.Column("region_id", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("grid_location", sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column("map_name", sa.String(length=200), nullable=True))
        batch_op.create_foreign_key(
            "fk_locations_region_id_regions",
            "regions",
            ["region_id"],
            ["id"],
            ondelete="SET NULL",
        )


def downgrade():
    with op.batch_alter_table("locations") as batch_op:
        batch_op.drop_constraint("fk_locations_region_id_regions", type_="foreignkey")
        batch_op.drop_column("map_name")
        batch_op.drop_column("grid_location")
        batch_op.drop_column("region_id")

    op.drop_index(op.f("ix_regions_name"), table_name="regions")
    op.drop_table("regions")
