import json
import os
import shutil
import sqlite3
import tempfile
import zipfile

# from datetime import datetime

# from models.deck import Deck
# from models.note import Note
# from models.note_type import NoteType
# from crud.deck import create_deck
# from crud.note import create_note
# from crud.note_type import create_note_type
# from database import SessionLocal

# Anki 字段内容的分隔符
FIELD_SEPARATOR = "\x1f"


def parse_apkg(apkg_path):
    """解析 Anki .apkg 文件并提取信息。"""
    extracted_data = {"decks": {}, "models": {}, "notes": [], "media_files": {}}

    # 创建一个临时目录来解压文件
    temp_dir = tempfile.mkdtemp()
    print(f"[*] 解压 .apkg 文件到临时目录: {temp_dir}")

    try:
        # 1. 解压缩 .apkg 文件
        with zipfile.ZipFile(apkg_path, "r") as zf:
            zf.extractall(temp_dir)

        # 2. 处理 media 文件 (如果存在)
        media_json_path = os.path.join(temp_dir, "media")
        if os.path.exists(media_json_path):
            with open(media_json_path, encoding="utf-8") as f:
                media_mapping = json.load(f)
                extracted_data["media_files"] = media_mapping
                print(f"[*] 找到 {len(media_mapping)} 个媒体文件映射。")
                # 你可以在这里添加逻辑来复制或处理实际的媒体文件
                # 它们在 temp_dir 下以数字命名 (e.g., temp_dir/0, temp_dir/1)

        # 3. 确定数据库文件名
        db_path_anki2 = os.path.join(temp_dir, "collection.anki2")
        db_path_anki21 = os.path.join(temp_dir, "collection.anki21")

        db_path = None
        if os.path.exists(db_path_anki21):
            db_path = db_path_anki21
            print("[*] 找到 collection.anki21 数据库。")
        elif os.path.exists(db_path_anki2):
            db_path = db_path_anki2
            print("[*] 找到 collection.anki2 数据库。")
        else:
            print(
                "[!] 错误: 在解压的目录中未找到 collection.anki2 或 collection.anki21。"
            )
            return None

        # 4. 连接并查询 SQLite 数据库
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # 获取牌组 (Decks) 信息
        # 牌组信息存储在 col 表的 decks 字段 (JSON 字符串)
        cursor.execute("SELECT decks FROM col")
        decks_json_str = cursor.fetchone()[0]
        decks_data = json.loads(decks_json_str)
        for deck_id, deck_info in decks_data.items():
            extracted_data["decks"][deck_id] = {
                "name": deck_info.get("name"),
                "id": deck_info.get("id"),  # deck_id 也是 id
            }
        print(f"[*] 提取了 {len(extracted_data['decks'])} 个牌组信息。")

        # 获取模型 (Note Types / Models) 信息
        # 模型信息存储在 col 表的 models 字段 (JSON 字符串)
        cursor.execute("SELECT models FROM col")
        models_json_str = cursor.fetchone()[0]
        models_data = json.loads(models_json_str)
        for model_id, model_info in models_data.items():
            field_names = [fld.get("name") for fld in model_info.get("flds", [])]
            extracted_data["models"][model_id] = {
                "name": model_info.get("name"),
                "id": model_info.get("id"),  # model_id 也是 id
                "field_names": field_names,
            }
        print(f"[*] 提取了 {len(extracted_data['models'])} 个模型信息。")

        # 获取笔记 (Notes) 信息
        # notes 表: id (note_id), mid (model_id), flds (fields, 以 \x1f 分隔), tags
        cursor.execute("SELECT id, mid, flds, tags FROM notes")
        notes_rows = cursor.fetchall()
        for note_row in notes_rows:
            note_id, model_id, flds_str, tags_str = note_row

            # 解析字段
            fields_content = flds_str.split(FIELD_SEPARATOR)

            # 获取模型名称和字段名称
            model_info = extracted_data["models"].get(
                str(model_id)
            )  # model_id 在 JSON 中是字符串键
            model_name = model_info["name"] if model_info else "未知模型"
            field_names = model_info["field_names"] if model_info else []

            # 将字段内容与字段名对应起来
            note_fields_dict = {}
            for i, content in enumerate(fields_content):
                field_name = field_names[i] if i < len(field_names) else f"字段_{i + 1}"
                note_fields_dict[field_name] = content

            note_data = {
                "id": note_id,
                "model_id": model_id,
                "model_name": model_name,
                "fields": note_fields_dict,
                "tags": tags_str.strip().split(" ") if tags_str.strip() else [],
            }
            extracted_data["notes"].append(note_data)
        print(f"[*] 提取了 {len(extracted_data['notes'])} 条笔记。")

        # 你还可以查询 cards 表来获取卡片信息，它通过 nid (note_id) 和 did (deck_id) 关联
        # cursor.execute("SELECT id, nid, did, ord, C FROM cards")
        # cards_rows = cursor.fetchall()
        # for card_row in cards_rows:
        #     card_id, note_id, deck_id, ord_val = card_row # ord 是卡片模板的序号
        #     deck_name = extracted_data["decks"].get(str(deck_id), {}).get("name", "未知牌组")
        #     print(f"    Card ID: {card_id}, Note ID: {note_id}, Deck: {deck_name}, Template Order: {ord_val}")
        conn.close()

    except Exception as e:
        print(f"[!] 解析过程中发生错误: {e}")
        return None
    finally:
        # 清理临时目录
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
            print(f"[*] 已清理临时目录: {temp_dir}")

    return extracted_data


if __name__ == "__main__":
    # 使用真实的 .apkg 文件路径
    apkg_file_path = (
        "/Users/adamzhou/Desktop/anki-memory-card/api/.apkg/大学英语四级.apkg"
    )

    if os.path.exists(apkg_file_path):
        data = parse_apkg(apkg_file_path)
        if data:
            print("\n--- 解析结果 ---")

            # # 创建数据库会话
            # db = SessionLocal()
            # try:
            #     # 保存模型信息
            #     model_id_map = {}  # 用于映射原始ID到新ID
            #     for model_id, model_info in data["models"].items():
            #         note_type = create_note_type(
            #             db,
            #             name=model_info["name"],
            #             fields=model_info["field_names"]
            #         )
            #         model_id_map[model_id] = note_type.id
            #         print(f"已保存模型: {model_info['name']}")

            #     # 保存牌组信息
            #     deck_id_map = {}  # 用于映射原始ID到新ID
            #     for deck_id, deck_info in data["decks"].items():
            #         deck = create_deck(
            #             db,
            #             name=deck_info["name"]
            #         )
            #         deck_id_map[deck_id] = deck.id
            #         print(f"已保存牌组: {deck_info['name']}")

            #     # 保存笔记信息
            #     for note in data["notes"]:
            #         # 创建笔记
            #         note_data = {
            #             "note_type_id": model_id_map[str(note["model_id"])],
            #             "fields": note["fields"],
            #             "tags": note["tags"]
            #         }
            #         created_note = create_note(db, note_data)
            #         print(f"已保存笔记 ID: {created_note.id}")

            #     db.commit()
            #     print("\n[*] 所有数据已成功导入到数据库")

            # except Exception as e:
            #     db.rollback()
            #     print(f"[!] 导入数据时发生错误: {e}")
            # finally:
            #     db.close()
    else:
        print(f"[!] 错误: .apkg 文件 '{apkg_file_path}' 不存在。请检查路径。")
