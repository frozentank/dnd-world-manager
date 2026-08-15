from alembic import op
import sqlalchemy as sa

revision = "0003_add_npc_import_fields"
down_revision = "0002_add_regions_and_map_fields"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("npcs") as batch_op:
        batch_op.add_column(sa.Column("profession", sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column("race", sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column("gender", sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column("quirk", sa.Text(), nullable=True))
        batch_op.add_column(sa.Column("location_id", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("region_id", sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            "fk_npcs_location_id_locations",
            "locations",
            ["location_id"],
            ["id"],
            ondelete="SET NULL",
        )
        batch_op.create_foreign_key(
            "fk_npcs_region_id_regions",
            "regions",
            ["region_id"],
            ["id"],
            ondelete="SET NULL",
        )


def downgrade():
    with op.batch_alter_table("npcs") as batch_op:
        batch_op.drop_constraint("fk_npcs_region_id_regions", type_="foreignkey")
        batch_op.drop_constraint("fk_npcs_location_id_locations", type_="foreignkey")
        batch_op.drop_column("region_id")
        batch_op.drop_column("location_id")
        batch_op.drop_column("quirk")
        batch_op.drop_column("gender")
        batch_op.drop_column("race")
        batch_op.drop_column("profession")
