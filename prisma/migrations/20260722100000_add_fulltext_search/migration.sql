-- Full-text search setup (run after initial migration)
-- Enable extensions in Supabase SQL editor:
-- CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE item ADD COLUMN IF NOT EXISTS "searchVector" tsvector;

CREATE OR REPLACE FUNCTION item_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW."searchVector" :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW."plainText", '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS item_search_vector_trigger ON item;
CREATE TRIGGER item_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, "plainText"
  ON item
  FOR EACH ROW
  EXECUTE FUNCTION item_search_vector_update();

CREATE INDEX IF NOT EXISTS item_search_vector_idx ON item USING GIN ("searchVector");

-- Update existing rows
UPDATE item SET title = title WHERE "searchVector" IS NULL;
