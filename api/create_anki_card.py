# To run this code you need to install the following dependencies:
# pip install google-genai

import os

from google import genai
from google.genai import types


def generate_in_non_stream_mode():
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    model = "gemini-1.5-flash-8b"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""succession"""),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="text/plain",
        system_instruction=[
            types.Part.from_text(text="""
你是一位非常擅长制作 Anki 记忆卡的大师，尤其擅长制作英文单词及句子类的记忆卡。
当我给你发送一个英文单词或一组句子的时候，你会按照<格式>，并参考<示例>帮我制作一张通用格式的 Anki 记忆卡。
请注意只需要给出 Anki 记忆卡，不要做任何额外的解释。

<格式>
```json
{
    \"单词\": \"\",
    \"详细资料\": \"\",
    \"英美音标\": \"\",
    \"中文释义\": \"\",
    \"英语例句\": \"\",
    \"英语例句对应的中文翻译\": \"\",
    \"笔记\": \"\",
    \"英语发音\": \"\",
    \"标签\": \"\"
}
```
</格式>

<示例>
输入：adhere
输出：
```json
{
    \"单词\": \"adhere\",
    \"详细资料\": \"v. (adheres, adhering, adhered) 1. To stick fast to (a surface or substance). Synonyms: stick, cling, cohere, bond. 2. To believe in and follow the practices of. Synonyms: abide by, stick to, hold to, comply with. Etymology: from Latin 'adhaerere' (ad- 'to' + haerere 'to stick').\",
    \"英美音标\": \"UK: /ədˈhɪə(r)/ US: /ədˈhɪr/\",
    \"中文释义\": \"v. 黏附，附着；遵守，坚持；拥护，支持\",
    \"英语例句\": \"All members must adhere to the club's rules and regulations.\",
    \"英语例句对应的中文翻译\": \"所有成员都必须遵守俱乐部的规章制度。\",
    \"笔记\": \"Common collocation: adhere to (rules, principles, a plan, a belief). It is more formal than 'stick to'.\",
    \"英语发音\": \"[sound:adhere.mp3]\",
    \"标签\": \"verb formal C1\"
}
```
</示例>
"""),
        ],
    )

    response = client.models.generate_content(
        model=model,
        contents=contents,
        config=generate_content_config,
    )
    print(response.text)


def generate_in_stream_mode():
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    model = "gemini-1.5-flash-8b"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""succession"""),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="text/plain",
        system_instruction=[
            types.Part.from_text(text="""
你是一位非常擅长制作 Anki 记忆卡的大师，尤其擅长制作英文单词及句子类的记忆卡。
当我给你发送一个英文单词或一组句子的时候，你会按照<格式>，并参考<示例>帮我制作一张通用格式的 Anki 记忆卡。
请注意只需要给出 Anki 记忆卡，不要做任何额外的解释。

<格式>
```json
{
    \"单词\": \"\",
    \"详细资料\": \"\",
    \"英美音标\": \"\",
    \"中文释义\": \"\",
    \"英语例句\": \"\",
    \"英语例句对应的中文翻译\": \"\",
    \"笔记\": \"\",
    \"英语发音\": \"\",
    \"标签\": \"\"
}
```
</格式>

<示例>
输入：adhere
输出：
```json
{
    \"单词\": \"adhere\",
    \"详细资料\": \"v. (adheres, adhering, adhered) 1. To stick fast to (a surface or substance). Synonyms: stick, cling, cohere, bond. 2. To believe in and follow the practices of. Synonyms: abide by, stick to, hold to, comply with. Etymology: from Latin 'adhaerere' (ad- 'to' + haerere 'to stick').\",
    \"英美音标\": \"UK: /ədˈhɪə(r)/ US: /ədˈhɪr/\",
    \"中文释义\": \"v. 黏附，附着；遵守，坚持；拥护，支持\",
    \"英语例句\": \"All members must adhere to the club's rules and regulations.\",
    \"英语例句对应的中文翻译\": \"所有成员都必须遵守俱乐部的规章制度。\",
    \"笔记\": \"Common collocation: adhere to (rules, principles, a plan, a belief). It is more formal than 'stick to'.\",
    \"英语发音\": \"[sound:adhere.mp3]\",
    \"标签\": \"verb formal C1\"
}
```
</示例>
"""),
        ],
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")


if __name__ == "__main__":
    # generate_in_stream_mode()
    import time
    st = time.time()
    generate_in_non_stream_mode()
    print(f"Time taken: {time.time() - st} seconds")
