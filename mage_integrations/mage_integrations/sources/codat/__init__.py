from mage_integrations.sources.base import Source, main
from mage_integrations.sources.catalog import Catalog
from mage_integrations.sources.codat.tap_codat import discover, check_credentials_are_authorized, load_and_write_schema
from mage_integrations.sources.codat.tap_codat.context import Context
from mage_integrations.sources.codat.tap_codat import streams as streams_

from typing import List, Dict, Generator
from datetime import datetime

class Codat(Source):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.ctx = Context(self.config, self.state)

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
    ) -> Generator[List[Dict], None, None]:
        self.ctx.catalog = self.catalog or self.discover(streams=self.selected_streams)
        if query is None:
            query = {}
        streams_.company.fetch_into_cache(self.ctx)
        tap_stream_id = stream.tap_stream_id
        stream_obj:streams_.Stream = next(stream for stream in streams_.all_streams if stream.tap_stream_id == tap_stream_id)

        return stream_obj.load_data(self.ctx)

    def sync(self, catalog: Catalog) -> None:
        self.ctx.catalog = catalog
        streams_.company.fetch_into_cache(self.ctx)
        streams = [s for s in streams_.all_streams
                if s.tap_stream_id in self.ctx.selected_stream_ids]
        for stream in streams:
            load_and_write_schema(self.ctx, stream)
            stream.sync(self.ctx)

    def test_connection(self) -> None:
        return check_credentials_are_authorized(self.ctx)


if __name__ == '__main__':
    main(Codat, schemas_folder='tap_codat/schemas')
