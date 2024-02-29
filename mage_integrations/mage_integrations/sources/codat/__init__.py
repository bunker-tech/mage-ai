from mage_integrations.sources.base import Source, main
from mage_integrations.sources.catalog import Catalog
from mage_integrations.sources.codat.tap_codat import discover, check_credentials_are_authorized, load_and_write_schema
from mage_integrations.sources.codat.tap_codat.context import Context
from mage_integrations.sources.codat.tap_codat import streams as streams_
from typing import List, Dict
from datetime import datetime

class Codat(Source):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.ctx = Context(self.config, self.state)

    def _load_company_from_config(self):
        self.ctx.cache["companies"] = self.ctx.config["company"]

    def discover(self, streams: List[str] = None) -> Catalog:
        return discover(self.ctx)
    
    def load_data(
        self,
        stream,
        bookmarks: Dict = None,
        query: Dict = None,
        sample_data: bool = False,
        start_date: datetime = None,
        **kwargs,
    ):
        pass


    def sync(self, catalog: Catalog) -> None:
        self.ctx.catalog = catalog
        streams_.company.fetch_into_cache(self.ctx)
        streams = [s for s in streams_.all_streams
                if s.tap_stream_id in self.ctx.selected_stream_ids]
        for stream in streams:
            self.ctx.write_state()
            load_and_write_schema(self.ctx, stream)
            stream.sync(self.ctx)
        self.ctx.write_state()

    def test_connection(self) -> None:
        return check_credentials_are_authorized(self.ctx)


if __name__ == '__main__':
    main(Codat, schemas_folder='tap_codat/schemas')
