import argparse
import sys
from typing import Dict, List, Any

import pandas as pd
import pyarrow as pa
from deltalake.writer import try_get_deltatable
from mage_integrations.destinations.base import Destination as BaseDestination
from mage_integrations.destinations.constants import (
    COLUMN_FORMAT_DATETIME,
    COLUMN_TYPE_ARRAY,
    COLUMN_TYPE_BOOLEAN,
    COLUMN_TYPE_INTEGER,
    COLUMN_TYPE_NULL,
    COLUMN_TYPE_NUMBER,
    COLUMN_TYPE_OBJECT,
    COLUMN_TYPE_STRING,
    KEY_RECORD,
)
from mage_integrations.destinations.delta_lake.constants import MODE_APPEND
from mage_integrations.destinations.delta_lake.raw_delta_table import RawDeltaTable

# from mage_integrations.destinations.delta_lake.schema import (
#     delta_arrow_schema_from_pandas,
# )
from mage_integrations.destinations.delta_lake.writer import write_deltalake
from mage_integrations.destinations.utils import update_record_with_internal_columns
from mage_integrations.utils.array import find
from mage_integrations.utils.dictionary import merge_dict

MAX_BYTE_SIZE_PER_WRITE = (5 * (1024 * 1024))


class DeltaLake(BaseDestination):
    @property
    def mode(self):
        return self.config.get('mode', MODE_APPEND)

    @property
    def table_name(self):
        return self.config['table']

    def build_client(self):
        raise Exception('Subclasses must implement the build_client method.')
    
    def get_schema_from_array(self, items: dict, level: int = 0):
        """Returns schema for an array.

        :param items: items definition of array
        :type items: dict
        :param level: depth level of array in jsonschema
        :type level: int
        :return: detected fields for items in array.
        :rtype: pyarrow datatype
        """
        type:List[Any] = items.get("type")
        # if there's anyOf instead of single type
        any_of_types = items.get("anyOf")
        # if the items are objects
        properties = items.get("properties")
        # if the items are an array itself
        items = items.get("items")

        if "integer" in type:
            return pa.int64()
        elif "number" in type:
            return pa.float64()
        elif "string" in type:
            return pa.string()
        elif "boolean" in type:
            return pa.bool_()
        elif "array" in type:
            return pa.list_(self.get_schema_from_array(items=items, level=level))
        elif "object" in type:
            return pa.struct(
                self.get_schema_from_object(props=properties, level=level + 1)
            )
        else:
            return pa.null()

    def get_schema_from_object(self, props: dict, level: int = 0):
        """Returns schema for an object.

        :param properties: properties definition of object
        :type properties: dict
        :param level: depth level of object in jsonschema
        :type level: int
        :return: detected fields for properties in object.
        :rtype: pyarrow datatype
        """
        fields = []
        for key, val in props.items():
            print([f.type for f in fields])
            if "type" in val.keys():
                type = val["type"]
                format = val.get("format")
            else:
                raise Exception("Type not found in definition")

            if "integer" in type:
                fields.append(pa.field(name=key, type=pa.int64(), nullable=True))
            elif "number" in type:
                fields.append(pa.field(name=key, type=pa.float64(), nullable=True))
            elif "boolean" in type:
                fields.append(pa.field(name=key, type=pa.bool_(), nullable=True))
            elif "string" in type:
                    fields.append(pa.field(name=key, type=pa.string(), nullable=True))
            elif "array" in type:
                items = val.get("items")
                if items:
                    item_type = self.get_schema_from_array(items=items, level=level)
                    if item_type == pa.null():
                        raise Exception("Array type not found")
                    fields.append(pa.field(key, pa.list_(item_type)))
                else:
                    fields.append(pa.field(key, pa.list_(pa.null())))
            elif "object" in type:
                child_object_prop = val.get("properties")
                inner_fields = self.get_schema_from_object(child_object_prop, level + 1)
                if not inner_fields:
                    raise Exception("No fields found in object")
                fields.append(pa.field(key, pa.struct(inner_fields)))
                
        return fields

    def build_schema(self, stream: str):# -> tuple[DataFrame, Any]:

        fields = self.get_schema_from_object(self.schemas[stream]['properties'])
        schema = pa.schema(fields, metadata={})

        return schema

    def build_storage_options(self) -> Dict:
        raise Exception('Subclasses must implement the build_storage_options method.')

    def build_table_uri(self, stream: str) -> str:
        raise Exception('Subclasses must implement the build_table_uri method.')

    def check_and_create_delta_log(self, stream: str) -> bool:
        raise Exception('Subclasses must implement the check_and_create_delta_log method.')

    def get_table_for_stream(self, stream: str):
        storage_options = self.build_storage_options()
        table_uri = self.build_table_uri(stream)
        table = try_get_deltatable(table_uri, storage_options)

        if table:
            raw_dt = table._table
            table._table = RawDeltaTable(raw_dt)

        return table

    def export_batch_data(self, record_data: List[Dict], stream: str, tags: Dict = None) -> None:
        storage_options = self.build_storage_options()
        friendly_table_name = self.config['table']
        table_uri = self.build_table_uri(stream)

        tags = dict(
            records=len(record_data),
            stream=stream,
            table_name=friendly_table_name,
            table_uri=table_uri,
        )

        self.logger.info('Export data started.', tags=tags)

        self.logger.info('Checking if delta logs exist...', tags=tags)
        if self.check_and_create_delta_log(stream):
            self.logger.info('Existing delta logs exist.', tags=tags)
        else:
            self.logger.info('No delta logs exist.', tags=tags)

        self.logger.info(f'Checking if table {friendly_table_name} exists...', tags=tags)
        table = self.get_table_for_stream(stream)
        if table:
            self.logger.info(f'Table {friendly_table_name} already exists.', tags=tags)
        else:
            self.logger.info(f'Table {friendly_table_name} doesn’t exists.', tags=tags)

        for r in record_data:
            r['record'] = update_record_with_internal_columns(r['record'])

        # if self.disable_column_type_check.get(stream):
        #     for column_name in self.schemas[stream]['properties'].keys():
        #         df[column_name] = df[column_name].fillna('')
        #     dt, schema = delta_arrow_schema_from_pandas(df)
        #     df = dt.to_pandas()
        # else:
        schema = self.build_schema(stream)
        fields = set([property.name for property in schema])
        mapping = {
                    f: [row[KEY_RECORD].get(f) for row in record_data]
                    for f in fields
                }
        paTable = pa.Table.from_pydict(mapping=mapping, schema=schema)
        df = paTable.to_pandas()
        df_count = len(df.index)

        idx = 0
        total_byte_size = int(df.memory_usage(deep=True).sum())
        tags2 = merge_dict(tags, dict(
            total_byte_size=total_byte_size,
        ))

        self.logger.info(f'Inserting records for batch {idx} started.', tags=tags2)

        write_deltalake(
            table or table_uri,
            data=df,
            mode=self.mode,
            overwrite_schema=True,
            partition_by=self.partition_keys.get(stream, []),
            schema=schema,
            storage_options=storage_options,
        )

        self.logger.info(f'Inserting records for batch {idx} completed.', tags=tags2)

        self.__after_write_for_batch(stream, idx, tags=tags2)

        tags.update(records_inserted=df_count)

        self.logger.info('Export data completed.', tags=tags)

    def after_write_for_batch(self, stream, index, **kwargs) -> None:
        pass

    def __after_write_for_batch(self, stream, index, **kwargs) -> None:
        tags = kwargs.get('tags', {})

        self.logger.info(f'Handle after write callback for batch {index} started.', tags=tags)
        self.after_write_for_batch(stream, index, **kwargs)
        self.logger.info(f'Handle after write callback for batch {index} completed.', tags=tags)


def main(destination_class):
    destination = destination_class(
        argument_parser=argparse.ArgumentParser(),
        batch_processing=True,
    )
    destination.process(sys.stdin.buffer)
