import sys
from models.history_model import get_history, delete_history, insert_history

records = get_history()
print("Before:", len(records))

if records:
    del_id = records[0]['_id']
    print("Deleting:", del_id)
    success = delete_history(del_id)
    print("Delete success:", success)

    records_after = get_history()
    print("After:", len(records_after))
else:
    print("No records found, creating one...")
    ins_id = insert_history("test.jpg", "test", "test", "en", "simple")
    print("Created:", ins_id)

